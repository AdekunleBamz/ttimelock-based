import { useState, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  show: (notification: Omit<Notification, 'id'>) => string;
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export function useNotifications(defaultDuration = 5000): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const show = useCallback((notification: Omit<Notification, 'id'>): string => {
    const id = generateId();
    const duration = notification.duration ?? defaultDuration;
    
    const newNotification: Notification = {
      ...notification,
      id,
      dismissible: notification.dismissible ?? true,
    };

    setNotifications(prev => [...prev, newNotification]);

    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }

    return id;
  }, [defaultDuration, dismiss]);

  const success = useCallback((title: string, message?: string) => 
    show({ type: 'success', title, message }), [show]);

  const error = useCallback((title: string, message?: string) => 
    show({ type: 'error', title, message, duration: 0 }), [show]);

  const warning = useCallback((title: string, message?: string) => 
    show({ type: 'warning', title, message }), [show]);

  const info = useCallback((title: string, message?: string) => 
    show({ type: 'info', title, message }), [show]);

  return {
    notifications,
    show,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };
}
