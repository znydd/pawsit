import type { Context } from "hono";
import {
    findNotificationsByUserId,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteAllNotifications,
} from "@/models/notification.model";

export const getNotifications = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    try {
        const notifications = await findNotificationsByUserId(user.id);
        return c.json({ success: true, notifications });
    } catch (error) {
        console.error("Get notifications error:", error);
        return c.json({ success: false, message: "Internal server error" }, 500);
    }
};

export const markAsRead = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
        return c.json({ success: false, message: "Invalid notification ID" }, 400);
    }

    try {
        const notification = await markNotificationAsRead(id, user.id);
        if (!notification) {
            return c.json({ success: false, message: "Notification not found" }, 404);
        }
        return c.json({ success: true, notification });
    } catch (error) {
        console.error("Mark as read error:", error);
        return c.json({ success: false, message: "Internal server error" }, 500);
    }
};

export const markAllAsRead = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    try {
        await markAllNotificationsAsRead(user.id);
        return c.json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        console.error("Mark all as read error:", error);
        return c.json({ success: false, message: "Internal server error" }, 500);
    }
};

export const clearAllNotifications = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    try {
        await deleteAllNotifications(user.id);
        return c.json({ success: true, message: "All notifications cleared" });
    } catch (error) {
        console.error("Clear notifications error:", error);
        return c.json({ success: false, message: "Internal server error" }, 500);
    }
};
