import { Hono } from "hono";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
} from "@/controllers/notification.controller";

const notificationRoutes = new Hono();

// Get all notifications for the current user
notificationRoutes.get("/", getNotifications);

// Mark a single notification as read
notificationRoutes.patch("/:id/read", markAsRead);

// Mark all notifications as read
notificationRoutes.patch("/read-all", markAllAsRead);

// Clear (delete) all notifications
notificationRoutes.delete("/", clearAllNotifications);

export default notificationRoutes;
