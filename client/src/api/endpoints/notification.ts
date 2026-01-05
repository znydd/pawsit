import { apiClient } from "@/api/client";

export interface Notification {
    id: number;
    userId: string;
    type: 'booking_accepted' | 'review_received' | 'review_reply';
    content: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export const notificationApi = {
    // Get all notifications for the current user
    getNotifications: async () => {
        const { data } = await apiClient.get('/notifications');
        return data.notifications as Notification[];
    },

    // Mark a single notification as read
    markAsRead: async (id: number) => {
        const { data } = await apiClient.patch(`/notifications/${id}/read`);
        return data.notification as Notification;
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        const { data } = await apiClient.patch('/notifications/read-all');
        return data;
    },

    // Clear (delete) all notifications
    clearAll: async () => {
        const { data } = await apiClient.delete('/notifications');
        return data;
    },
};
