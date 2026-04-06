import { create } from "zustand";

// Schema
import type { Notification, Notifications } from "@/services/notification/notification.schema";

// Utils para sorted
const sortNotifications = (notifications: Notifications) =>
  [...notifications].sort((a, b) => new Date(b.scheduled_for).getTime() - new Date(a.scheduled_for).getTime());

type NotificationState = {
  /**
   * Lista de notificações
   */
  notifications: Notifications;
  /**
   * Define lista completa de notificações (ex: load inicial)
   */
  setNotifications: (notifications: Notifications) => void;
  /**
   * Adiciona uma nova notificação
   */
  addNotification: (notification: Notification) => void;
  /**
   * Remove uma notificação existente
   */
  removeNotification: (id: number) => void;
  /**
   * Marca uma notificação como lida
   */
  markAsRead: (id: number) => void;
  /**
   * Limpa todas as notificações
   */
  clearAll: () => void;
  /**
   * Retorna a contagem de notificações não lidas
   */
  getUnreadCount: () => number;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  setNotifications: (notifications) =>
    set(() => ({
      notifications: sortNotifications(notifications),
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: sortNotifications([notification, ...state.notifications]),
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: 1 } : n)),
    })),

  clearAll: () =>
    set(() => ({
      notifications: [],
    })),

  getUnreadCount: () => {
    return get().notifications.filter((n) => n.read === 0).length;
  },
}));
