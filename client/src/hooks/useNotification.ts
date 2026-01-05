import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/api/endpoints/notification";
import { toast } from "sonner";

// Get all notifications with polling
export const useNotifications = () => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: () => notificationApi.getNotifications(),
        refetchInterval: 30000, // Poll every 30 seconds
    });
};

// Mark single notification as read
export const useMarkAsRead = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: notificationApi.markAsRead,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to mark notification as read");
        }
    });
};

// Mark all notifications as read
export const useMarkAllAsRead = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: notificationApi.markAllAsRead,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to mark all as read");
        }
    });
};

// Clear all notifications
export const useClearNotifications = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: notificationApi.clearAll,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] });
            toast.success("All notifications cleared");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to clear notifications");
        }
    });
};
