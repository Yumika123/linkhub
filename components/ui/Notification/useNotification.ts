import { create } from "zustand";

type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationData {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}

interface NotificationStore {
  notifications: NotificationData[];
  maxNotifications: number;
  addNotification: (
    type: NotificationType,
    message: string,
    title?: string,
    duration?: number
  ) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  success: (message: string, title?: string, duration?: number) => string;
  error: (message: string, title?: string, duration?: number) => string;
  warning: (message: string, title?: string, duration?: number) => string;
  info: (message: string, title?: string, duration?: number) => string;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  maxNotifications: 5,

  addNotification: (
    type: NotificationType,
    message: string,
    title?: string,
    duration: number = 5000
  ): string => {
    const id = `notification-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    set((state) => {
      const newNotifications = [
        { id, type, message, title, duration },
        ...state.notifications,
      ];
      // Limit the number of notifications
      return {
        notifications: newNotifications.slice(0, state.maxNotifications),
      };
    });

    return id;
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },

  success: (message: string, title?: string, duration?: number) => {
    return get().addNotification("success", message, title, duration);
  },

  error: (message: string, title?: string, duration?: number) => {
    return get().addNotification("error", message, title, duration);
  },

  warning: (message: string, title?: string, duration?: number) => {
    return get().addNotification("warning", message, title, duration);
  },

  info: (message: string, title?: string, duration?: number) => {
    return get().addNotification("info", message, title, duration);
  },
}));
