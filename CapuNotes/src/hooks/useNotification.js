// src/hooks/useNotification.js
import { useState } from 'react';

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      timestamp: new Date(),
    };

    setNotifications((prev) => [...prev, notification]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Métodos de conveniencia
  const showSuccess = (message, duration) =>
    addNotification(message, 'success', duration);
  const showError = (message, duration) =>
    addNotification(message, 'error', duration);
  const showWarning = (message, duration) =>
    addNotification(message, 'warning', duration);
  const showInfo = (message, duration) =>
    addNotification(message, 'info', duration);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
