import { db } from "@/db";
import { notificationTable } from "shared/src/db/schema";
import { eq, desc, and } from "drizzle-orm";

export type NotificationType = 
    | 'booking_accepted'
    | 'review_received'
    | 'review_reply';

interface CreateNotificationParams {
    userId: string;
    type: NotificationType;
    content: string;
}

export const createNotification = async (params: CreateNotificationParams) => {
    const [notification] = await db
        .insert(notificationTable)
        .values({
            userId: params.userId,
            type: params.type,
            content: params.content,
            updatedAt: new Date(),
        })
        .returning();
    return notification;
};

export const findNotificationsByUserId = async (userId: string) => {
    return db
        .select()
        .from(notificationTable)
        .where(eq(notificationTable.userId, userId))
        .orderBy(desc(notificationTable.createdAt));
};

export const markNotificationAsRead = async (id: number, userId: string) => {
    const [notification] = await db
        .update(notificationTable)
        .set({ isRead: true })
        .where(and(eq(notificationTable.id, id), eq(notificationTable.userId, userId)))
        .returning();
    return notification;
};

export const markAllNotificationsAsRead = async (userId: string) => {
    await db
        .update(notificationTable)
        .set({ isRead: true })
        .where(eq(notificationTable.userId, userId));
};

export const deleteAllNotifications = async (userId: string) => {
    await db
        .delete(notificationTable)
        .where(eq(notificationTable.userId, userId));
};
