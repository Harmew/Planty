// Services
import { CareService } from "@/services/care/care.service";
import { DatabaseService, TABLES } from "@/services/database/database.service";
import { StorageService } from "@/services/storage/storage.service";

// Dayjs
import dayjs from "dayjs";

// Store
import { usePlantStore } from "@/stores/use-plant-store";

// Schema
import {
  createPlantSchema,
  plantSchema,
  plantsSchema,
  type CreatePlant,
  type Plant,
  type Plants,
} from "./plant.schema";

/**
 * Serviço para lidar com a entidade Planta
 * @description Responsável por gerenciar as operações relacionadas às plantas
 */
export class PlantService implements IService {
  constructor(
    private database: DatabaseService,
    private storage: StorageService,
    private care: CareService,
  ) {}

  /**
   * Inicializa o serviço de plantas (roda na inicialização do app)
   */
  async init(): Promise<void> {}

  /**
   * Lista todas as plantas cadastradas
   * @returns Lista de plantas de forma estruturada
   */
  async getPlants(): Promise<Plants> {
    // 1. Busca todas as plantas no banco de dados
    const result = await this.database.getAll(`SELECT * FROM ${TABLES.plants}`);

    // 2. Valida e formata as plantas
    const plants = plantsSchema.parse(result);

    // 3. Atualiza o estado da planta na store
    usePlantStore.getState().setPlants(plants);

    // 4. Retorna as plantas
    return plants;
  }

  /**
   * Cria uma nova planta
   * @param input Dados da planta a ser criada
   * @returns A planta criada
   */
  async createPlant(input: CreatePlant): Promise<{ id: number }> {
    let imagePath: string | null = null;

    try {
      // 1. Pega a data atual
      const now = dayjs();
      const nowISO = now.toISOString();

      // 2. Valida e formata os dados da planta
      const parsed = createPlantSchema.parse(input);

      // 3. Salva imagem
      if (parsed.image?.uri) {
        imagePath = await this.storage.saveImage(parsed.image.uri);
      }

      // 4. Insere no banco
      const result = await this.database.run(
        `INSERT INTO ${TABLES.plants} (image, name, location, sunlight, temperature_max, temperature_min, humidity, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          imagePath,
          parsed.name,
          parsed.location,
          parsed.sunlight,
          parsed.temperature_max ?? null,
          parsed.temperature_min ?? null,
          parsed.humidity ?? null,
          nowISO,
        ],
      );

      // 5. Valida e formata a planta criada
      const plant = plantSchema.parse({
        ...parsed,
        image: imagePath,
        id: result.lastInsertRowId,
        created_at: nowISO,
      });

      // 6. Atualiza o estado da UI de planta
      usePlantStore.getState().addPlant(plant);

      // 7. Retorna o ID da planta criada
      return { id: result.lastInsertRowId };
    } catch (error: any) {
      // Deleta imagem caso contenha algum erro no fluxo de criação
      if (imagePath) {
        await this.storage.deleteImage(imagePath);
      }

      throw new Error(error.message || "Não foi possível criar a planta");
    }
  }

  /**
   * Atualiza uma planta
   * @param id ID da planta a ser atualizada
   * @param input Dados da planta a serem atualizados
   * @returns A planta atualizada
   */
  async updatePlant(id: number, input: Partial<CreatePlant>): Promise<void> {
    // 1. Busca planta existente
    const existing = await this.getPlantById(id);

    // 2. Verifica se a planta existe
    if (!existing) {
      throw new Error("Planta não encontrada");
    }

    // 3. Define os caminhos das imagens
    let newImagePath = existing.image;
    let oldImageToDelete: string | null = null;

    try {
      // 4. Atualiza a imagem (caso tenha mudado)
      if (input.image && input.image.uri !== existing.image) {
        // Salva a nova imagem
        newImagePath = await this.storage.saveImage(input.image.uri);

        // Só salva o path da imagem antiga para deletar depois
        oldImageToDelete = existing.image ?? null;
      }

      // 5. Monta o objeto atualizado
      const updated = {
        ...existing,
        ...Object.fromEntries(Object.entries(input).filter(([_, v]) => v !== undefined)),
        image: newImagePath,
      };

      // 6. Valida e formata a planta atualizada
      const parsed = plantSchema.parse(updated);

      // 7. Atualiza a planta no banco
      await this.database.run(
        `UPDATE ${TABLES.plants} SET image = ?, name = ?, location = ?, sunlight = ?, temperature_max = ?, temperature_min = ?, humidity = ? WHERE id = ?`,
        [
          parsed.image ?? null,
          parsed.name,
          parsed.location,
          parsed.sunlight,
          parsed.temperature_max ?? null,
          parsed.temperature_min ?? null,
          parsed.humidity ?? null,
          id,
        ],
      );

      // 8. Deleta a imagem antiga (caso tenha mudado)
      if (oldImageToDelete) {
        await this.storage.deleteImage(oldImageToDelete);
      }

      // 9. Atualiza o estado da UI de planta
      usePlantStore.getState().updatePlant(parsed);
    } catch (error: any) {
      // Deleta imagem caso contenha algum erro no fluxo de atualização
      if (newImagePath && newImagePath !== existing.image) {
        await this.storage.deleteImage(newImagePath);
      }

      throw new Error(error.message || "Não foi possível atualizar a planta");
    }
  }

  /**
   * Deleta uma planta
   * @param id ID da planta a ser deletada
   * @returns O ID da planta deletada
   */
  async deletePlant(id: number): Promise<void> {
    try {
      // 1. Busca planta existente
      const existing = await this.getPlantById(id);

      // 2. Verifica se a planta existe
      if (!existing) return;

      // 3. Deleta os cuidados dela (inclui notificações)
      await this.care.deleteCaresByPlant(id);

      // 4. Deleta a planta do banco
      await this.database.run(`DELETE FROM ${TABLES.plants} WHERE id = ?`, [id]);

      // 5. Deleta a imagem da planta (caso exista)
      if (existing.image) {
        await this.storage.deleteImage(existing.image);
      }

      // 6. Atualiza o estado da UI de planta
      usePlantStore.getState().removePlant(id);
    } catch (error: any) {
      throw new Error(error.message || "Não foi possível excluir a planta");
    }
  }

  /**
   * Busca uma planta pelo ID
   * @param id ID da planta
   * @returns A planta encontrada ou null
   */
  private async getPlantById(id: number): Promise<Plant | null> {
    // 1. Busca a planta no banco
    const plant = await this.database.getOne(`SELECT * FROM ${TABLES.plants} WHERE id = ?`, [id]);

    // 2. Verifica se a planta existe
    if (!plant) return null;

    // 3. Valida e formata a planta encontrada
    return plantSchema.parse(plant);
  }
}
