// Day Js
import dayjs from "dayjs";

// Services
import { DatabaseService, TABLES } from "@/services/database/database.service";
import { NotificationService } from "@/services/notification/notification.service";

// Stores
import { useCareHistoryStore } from "@/stores/use-care-history-store";
import { useCareStore } from "@/stores/use-care-store";

// Schema
import { careHistorySchema } from "./care-history.schema";
import {
  careSchema,
  careType,
  caresSchema,
  createCaresSchema,
  type Care,
  type CareType,
  type CreateCares,
} from "./care.schema";

// Utils
import { getNotificationBody, getNotificationTitle, toDateOnly } from "@/utils";

/**
 * Serviço responsável por gerenciar os cuidados das plantas (regar, adubar, podar, replantar)
 * - Criação de regras de cuidado (ex: regar a cada 3 dias)
 * - Marcar cuidado como feito (regar, adubar)
 * - Buscar cuidados da planta
 * - Remover cuidado
 * - Listar cuidados atrasados / hoje
 *
 * Integração com NotificationService para criar notificações automáticas baseadas nas regras de cuidado.
 */
export class CareService {
  constructor(
    private database: DatabaseService,
    private notificationService: NotificationService,
  ) {}

  /**
   * Busca todos os cuidados de uma planta
   * @param plantId ID da planta
   */
  public async getCaresByPlant(plantId: number): Promise<void> {
    // 1. Busca todos os cuidados da planta no banco de dados
    const result = await this.database.getAll(`SELECT * FROM ${TABLES.care_schedule} WHERE plant_id = ?`, [plantId]);

    // 2. Valida e formata as plantas
    const cares = caresSchema.parse(result);

    // 3. Atualiza o estado da store com os cuidados da planta
    useCareStore.getState().setCares(plantId, cares);
  }

  /**
   * Busca o histórico de cuidados de uma planta
   * @param plantId ID da planta
   */
  public async getHistoryByPlant(plantId: number): Promise<void> {
    // 1. Busca o histórico de cuidados da planta no banco de dados
    const result = await this.database.getAll(`SELECT * FROM ${TABLES.care_history} WHERE plant_id = ?`, [plantId]);

    // 2. Valida e formata o histórico de cuidados
    const history = result
      .map((item) => careHistorySchema.safeParse(item))
      .filter((result) => result.success)
      .map((result) => result.data);

    // 3. Atualiza o estado da store com o histórico de cuidados da planta
    useCareHistoryStore.getState().setHistory(plantId, history);
  }

  /**
   * Marca cuidado como feito e insere no histórico
   * @param plantId ID da planta
   * @param type Tipo do cuidado (water, fertilizer, prune, repot)
   * @returns Cuidado atualizado e histórico criado
   */
  async markAsDone(plantId: number, type: CareType): Promise<void> {
    const now = dayjs();
    const newDateOnly = toDateOnly(now);
    const nowISO = now.toISOString();

    const rawCare = await this.database.getOne(
      `SELECT * FROM ${TABLES.care_schedule} WHERE plant_id = ? AND type = ?`,
      [plantId, type],
    );

    if (!rawCare) throw new Error("Cuidado não encontrado");
    const care = careSchema.parse(rawCare);

    const nextDue = toDateOnly(now.add(care.interval_days, "day"));

    // 1. Atualiza schedule
    await this.database.run(`UPDATE ${TABLES.care_schedule} SET last_done = ?, next_due = ? WHERE id = ?`, [
      newDateOnly,
      nextDue,
      care.id,
    ]);

    await this.notificationService.cancelByCareId(care.id);

    const query = await this.database.getOne<{ name: string }>(`SELECT name FROM ${TABLES.plants} WHERE id = ?`, [
      care.plant_id,
    ]);

    if (!query) throw new Error("Planta não encontrada");

    await this.scheduleNotificationForCare({ ...care, next_due: nextDue }, plantId, query.name);

    // 2. Cria o histórico do cuidado
    const result = await this.database.run(
      `INSERT INTO ${TABLES.care_history} (plant_id, care_schedule_id, type, interval_days, done_at) VALUES (?, ?, ?, ?, ?)`,
      [plantId, care.id, type, care.interval_days, nowISO],
    );

    const history = careHistorySchema.parse({
      id: result.lastInsertRowId,
      plant_id: plantId,
      care_schedule_id: care.id,
      interval_days: care.interval_days,
      type,
      done_at: nowISO,
    });

    // 3. Busca o cuidado atualizado
    const updatedCare = careSchema.parse({
      ...care,
      last_done: newDateOnly,
      next_due: nextDue,
    });

    useCareStore.getState().upsertCare(plantId, updatedCare);
    useCareHistoryStore.getState().addHistory(plantId, history);
  }

  /**
   * Cria ou atualiza os cuidados de uma planta
   * @param id ID da planta
   * @param input Dados dos cuidados a serem criados ou atualizados
   */
  public async createOrUpdateCares(plantId: number, input: CreateCares): Promise<void> {
    try {
      // 1. Valida e formata os dados dos cuidados
      const parsed = createCaresSchema.parse(input);

      for (const type of careType.options) {
        const careData = parsed[type];
        const existing = await this.getExistingCare(plantId, type);

        // 3.1 Se cuidado informado estiver habilitado, cria ou atualiza o mesmo
        if (careData.enabled) {
          //  Se já existir, atualiza. Caso contrário, cria um novo cuidado
          if (existing) await this.updateCare(existing, careData);
          else await this.createCare(plantId, type, careData);

          // 3.2 Se cuidado informado estiver desabilitado e já existir, remove o mesmo
        } else if (existing) {
          await this.deleteCare(existing);
        }
      }

      // Atualiza os cuidados da planta na store
      await this.getCaresByPlant(plantId);
    } catch (error: any) {
      throw new Error(error.message || "Não foi possível salvar os cuidados da planta");
    }
  }

  /**
   * Busca cuidado específico de uma planta por tipo (regar, adubar, podar, replantar)
   * @param plantId ID da planta
   * @param type Tipo do cuidado (water, fertilizer, prune, repot)
   * @returns Cuidado encontrado ou null se não existir
   */
  private async getExistingCare(plantId: number, type: CareType): Promise<Care | null> {
    // 1. Busca cuidado existente
    const result = await this.database.getOne(`SELECT * FROM ${TABLES.care_schedule} WHERE plant_id = ? AND type = ?`, [
      plantId,
      type,
    ]);

    // 2. Retorna cuidado encontrado ou null
    if (!result) return null;

    // 3. Valida e formata cuidado encontrado
    return careSchema.parse(result);
  }

  /**
   * Cria um cuidado para uma planta
   * @param plantId  ID da planta
   * @param type Tipo do cuidado (water, fertilizer, prune, repot)
   * @param careData Dados do cuidado a ser criado (intervalo de dias)
   */
  private async createCare(plantId: number, type: CareType, careData: { interval_days: string }): Promise<void> {
    try {
      // 1. Calcula próxima data de cuidado
      const now = dayjs();
      const nowISO = now.toISOString();

      const interval_days = Number(careData.interval_days);
      const next_due = toDateOnly(now.add(interval_days, "day"));

      const result = await this.database.run(
        `INSERT INTO ${TABLES.care_schedule} (plant_id, type, interval_days, last_done, next_due, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [plantId, type, interval_days, null, next_due, nowISO],
      );

      const care = careSchema.parse({
        id: result.lastInsertRowId,
        plant_id: plantId,
        type,
        interval_days,
        last_done: null,
        next_due,
        created_at: nowISO,
      });

      const query = await this.database.getOne<{ name: string }>(`SELECT name FROM ${TABLES.plants} WHERE id = ?`, [
        plantId,
      ]);

      if (!query) throw new Error("Planta não encontrada");

      await this.scheduleNotificationForCare(care, plantId, query.name);
    } catch (error: any) {
      throw new Error(error.message || "Não foi possível criar o cuidado");
    }
  }

  /**
   * Atualiza um cuidado existente de uma planta
   * @param care Cuidado existente a ser atualizado
   * @param careData Dados do cuidado a ser atualizado (intervalo de dias)
   * @returns Cuidado atualizado
   */
  private async updateCare(care: Care, careData: { interval_days: string }): Promise<void> {
    try {
      // 1. Calcula próxima data de cuidado
      const now = dayjs();
      const interval_days = Number(careData.interval_days);
      const next_due = toDateOnly(now.add(interval_days, "day"));

      await this.database.run(`UPDATE ${TABLES.care_schedule} SET interval_days = ?, next_due = ? WHERE id = ?`, [
        interval_days,
        next_due,
        care.id,
      ]);

      const updatedCare = careSchema.parse({
        ...care,
        interval_days,
        next_due,
      });

      // Cancela a notificação antiga
      await this.notificationService.cancelByCareId(care.id);

      const query = await this.database.getOne<{ name: string }>(`SELECT name FROM ${TABLES.plants} WHERE id = ?`, [
        care.plant_id,
      ]);

      if (!query) throw new Error("Planta não encontrada");

      // Agenda nova notificação
      await this.scheduleNotificationForCare(updatedCare, care.plant_id, query.name);
    } catch (error: any) {
      throw new Error(error.message || "Não foi possível atualizar o cuidado");
    }
  }

  /**
   * Deleta um cuidado de uma planta
   * @description Não exclui o histórico de cuidados para ter um registro
   * @param care Cuidado a ser deletado
   * @returns void
   */
  private async deleteCare(care: Care): Promise<void> {
    try {
      await this.notificationService.cancelByCareId(care.id);
      await this.database.run(`DELETE FROM ${TABLES.care_schedule} WHERE id = ?`, [care.id]);
    } catch (error: any) {
      throw new Error(error.message || "Não foi possível excluir o cuidado");
    }
  }

  async deleteCaresByPlant(plantId: number): Promise<void> {
    try {
      // 1. Busca todos os cuidados da planta
      const cares = await this.database.getAll<{ id: number }>(
        `SELECT id FROM ${TABLES.care_schedule} WHERE plant_id = ?`,
        [plantId],
      );

      // 2. Cancela tudo em paralelo
      await Promise.all(cares.map((care) => this.notificationService.cancelByCareId(care.id)));

      // 3. Remove os cuidados do banco de dados
      await this.database.run(`DELETE FROM ${TABLES.care_schedule} WHERE plant_id = ?`, [plantId]);

      // 4. Atualiza o estado da store
      useCareStore.getState().removeCaresByPlant(plantId);
    } catch (error: any) {
      throw new Error(error.message || "Não foi possível excluir os cuidados da planta");
    }
  }

  /**
   * Agenda uma notificação para um cuidado de planta
   * @param care Cuidado a ser agendado
   * @param plantId ID da planta
   * @param plantName Nome da planta
   */
  private async scheduleNotificationForCare(care: Care, plantId: number, plantName: string) {
    await this.notificationService.schedule({
      plant_id: plantId,
      care_schedule_id: care.id,
      title: getNotificationTitle(care.type),
      body: getNotificationBody(plantName, care.type),
      type: care.type,
      scheduled_for: care.next_due,
    });
  }
}
