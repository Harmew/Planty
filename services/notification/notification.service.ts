import { DatabaseService, TABLES } from "@/services/database/database.service";

// Expo Notifications
import * as ExpoNotifications from "expo-notifications";

// Store
import { useNotificationStore } from "@/stores/use-notification-store";

// Dayjs
import dayjs from "dayjs";

// Schema
import {
  type CreateNotification,
  createNotificationSchema,
  notificationSchema,
  notificationsSchema,
} from "./notification.schema";

type NotificationRow = {
  id: number;
  expo_notification_id: string | null;
};

/**
 * Serviço de Notificações
 * @description Este serviço é responsável por gerenciar as notificações do sistema.
 */
export class NotificationService implements IService {
  constructor(private database: DatabaseService) {}

  /**
   * Inicializa o serviço de notificações.
   * @description Configura o manipulador de notificações do Expo.
   */
  async init(): Promise<void> {
    ExpoNotifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        priority: ExpoNotifications.AndroidNotificationPriority.HIGH,
      }),
    });
  }

  /**
   * Lista notificações
   * @returns Lista de notificações
   */
  async getNotifications(): Promise<void> {
    // 1. Busca todas as notificações no banco de dados
    const result = await this.database.getAll(`SELECT * FROM ${TABLES.notifications}`);

    // 2. Valida e formata as notificações
    const notifications = notificationsSchema.parse(result);

    // 3. Atualiza o estado da notificação na store
    useNotificationStore.getState().setNotifications(notifications);
  }

  /**
   * Marca uma notificação como lida
   * @return ID da notificação lida
   */
  async markAsRead(id: number): Promise<void> {
    // 1. Marca a notificação como lida no banco de dados
    await this.database.run(`UPDATE ${TABLES.notifications} SET read = 1 WHERE id = ?`, [id]);

    // 2. Atualiza o estado da notificação na store
    useNotificationStore.getState().markAsRead(id);
  }

  /**
   * Agenda uma notificação para as 6:00 (horário local)
   * @param input Dados da notificação
   * @param date Data para agendar a notificação
   */
  async schedule(input: CreateNotification): Promise<void> {
    try {
      // 1. Valida e formata os dados da notificação
      const parsed = createNotificationSchema.parse(input);

      // Regra de negócio: Notificações devem ser agendadas para 06:00
      const scheduledDate = dayjs(parsed.scheduled_for).hour(6).minute(0).second(0).millisecond(0).toDate();

      // 2. Converte as datas para o formato ISO
      const scheduledISO = dayjs(scheduledDate).toISOString();
      const nowISO = dayjs().toISOString();

      // 3. Agenda a notificação
      const expoId = await ExpoNotifications.scheduleNotificationAsync({
        content: { title: parsed.title, body: parsed.body },
        trigger: { type: ExpoNotifications.SchedulableTriggerInputTypes.DATE, date: scheduledDate },
      });

      // 4. Salva a notificação no banco de dados
      const result = await this.database.run(
        `INSERT INTO notifications (plant_id, care_schedule_id, title, body, type, read, scheduled_for, expo_notification_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          parsed.plant_id,
          parsed.care_schedule_id,
          parsed.title,
          parsed.body,
          parsed.type,
          0,
          scheduledISO,
          expoId,
          nowISO,
        ],
      );

      // 5. Valida e formata a notificação criada
      const notification = notificationSchema.parse({
        ...parsed,
        scheduled_for: scheduledISO,
        id: result.lastInsertRowId,
        read: 0,
        expo_notification_id: expoId,
        created_at: nowISO,
      });

      // 6. Atualiza o estado da UI de notificações
      useNotificationStore.getState().addNotification(notification);
    } catch (error: any) {
      throw new Error(error.message || "Não foi possível agendar a notificação");
    }
  }

  /**
   * Cancela as notificações de um cuidaddo
   * @description Cancela todas as notificações de um cuidado agendado
   */
  async cancelByCareId(careScheduleId: number): Promise<void> {
    // 1. Busca todas as notificações do cuidado
    const rows = await this.database.getAll<NotificationRow>(
      `SELECT id, expo_notification_id FROM ${TABLES.notifications} WHERE care_schedule_id = ?`,
      [careScheduleId],
    );

    // 2. Cancela no sistema + remove da store
    for (const notification of rows) {
      // Cancela a notificação no sistema
      if (notification.expo_notification_id) {
        await ExpoNotifications.cancelScheduledNotificationAsync(notification.expo_notification_id);
      }

      // Remove a notificação da store
      useNotificationStore.getState().removeNotification(notification.id);
    }

    // 3. Remove do banco (UMA vez só)
    await this.database.run(`DELETE FROM ${TABLES.notifications} WHERE care_schedule_id = ?`, [careScheduleId]);
  }

  /**
   * Limpar todas (e cancela no sistema)
   * @description Cancela todas as notificações agendadas e remove do banco de dados
   */
  async clearAll() {
    // 1. Cancela todas as notificações agendadas no Expo
    await ExpoNotifications.cancelAllScheduledNotificationsAsync();

    // 2. Limpa banco
    await this.database.run(`DELETE FROM ${TABLES.notifications}`);

    // 3. Limpa UI
    useNotificationStore.getState().clearAll();
  }

  /**
   * Remove notificações antigas (mais de 3 meses)
   * @description Por regra de negocio do app, notificações com mais de 3 meses devem ser removidas para evitar acúmulo, já que não temos a opção de excluir notificações manualmente.
   */
  async cleanOldNotifications(): Promise<void> {
    try {
      // 1. Define limite de 3 meses
      const limitDate = dayjs().subtract(3, "month");
      const limitISO = limitDate.toISOString();

      // 2. Busca notificações antigas
      const notifications = await this.database.getAll<NotificationRow>(
        `SELECT id, expo_notification_id FROM ${TABLES.notifications} WHERE scheduled_for < ?`,
        [limitISO],
      );

      // 3. Cancela no sistema (se ainda existir)
      await Promise.all(
        notifications.map((notification) =>
          notification.expo_notification_id
            ? ExpoNotifications.cancelScheduledNotificationAsync(notification.expo_notification_id)
            : Promise.resolve(),
        ),
      );

      // 4. Remove do banco
      await this.database.run(`DELETE FROM ${TABLES.notifications} WHERE scheduled_for < ?`, [limitISO]);
    } catch (error: any) {
      console.warn("Não foi possível concluir a limpeza de notificações antigas:", error.message);
    }
  }
}
