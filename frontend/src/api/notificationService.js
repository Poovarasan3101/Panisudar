/**
 * Notification Service — Connected to real Django REST API
 * Django endpoints:
 *   GET   /api/notifications/
 *   GET   /api/notifications/unread-count/
 *   POST  /api/notifications/mark-all-read/
 *   PATCH /api/notifications/:id/
 */

import client from './client';

export const notificationService = {
  async getNotifications() {
    const { data } = await client.get('/notifications/');
    return Array.isArray(data) ? data : data.results || [];
  },

  async markAsRead(notificationId) {
    const { data } = await client.patch(`/notifications/${notificationId}/`, {
      is_read: true,
      isRead: true,
    });
    return data;
  },

  async markAllAsRead() {
    const { data } = await client.post('/notifications/mark-all-read/');
    return data;
  },

  async getUnreadCount() {
    try {
      const { data } = await client.get('/notifications/unread-count/');
      return data.unreadCount ?? data.unread_count ?? 0;
    } catch {
      return 0;
    }
  },
};

export default notificationService;
