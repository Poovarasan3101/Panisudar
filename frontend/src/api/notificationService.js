/**
 * Notification Service — mock + real API stubs
 * Django endpoint: GET /api/notifications/
 */

import { mockNotifications } from '@/mock/applications';

const USE_MOCK = true;
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let _notifications = [...mockNotifications];

export const notificationService = {
  async getNotifications() {
    if (USE_MOCK) {
      await delay();
      return [..._notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    // const { data } = await client.get('/notifications/'); return data;
  },

  async markAsRead(notificationId) {
    if (USE_MOCK) {
      const notif = _notifications.find((n) => n.id === notificationId);
      if (notif) notif.isRead = true;
      return { success: true };
    }
    // await client.patch(`/notifications/${notificationId}/`, { isRead: true });
  },

  async markAllAsRead() {
    if (USE_MOCK) {
      _notifications.forEach((n) => { n.isRead = true; });
      return { success: true };
    }
    // await client.post('/notifications/mark-all-read/');
  },

  getUnreadCount() {
    return _notifications.filter((n) => !n.isRead).length;
  },
};

export default notificationService;
