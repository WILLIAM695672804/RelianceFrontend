import api from './api';

export const notificationService = {
  getNotifications: (page = 1) => api.get(`/notifications?page=${page}`),
  markAsRead: (id: string) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  registerPushToken: (token: string, provider: string) =>
    api.post('/push-tokens', { token, provider }),
  removePushToken: (id: string) => api.delete(`/push-tokens/${id}`),
  getSettings: () => api.get('/notification-settings'),
  updateSettings: (data: Record<string, boolean>) =>
    api.put('/notification-settings', data),
};
