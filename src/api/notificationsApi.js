/**
 * UrbanEats Notifications API Functions
 */
import apiClient from './apiClient';

export async function fetchNotifications() {
  const res = await apiClient.get('/notifications/index.php');
  return res;
}

export async function markNotificationAsRead(id) {
  const res = await apiClient.post('/notifications/mark_read.php', { id });
  return res;
}

export async function markAllNotificationsAsRead() {
  const res = await apiClient.post('/notifications/mark_all_read.php', {});
  return res;
}
