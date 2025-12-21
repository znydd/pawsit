import { db } from "@/db";
import { petSitterTable, petOwnerTable } from "shared/src/db/schema";
import { eq } from "drizzle-orm";
import type { NewPetSitter } from "shared/dist";

// Find sitter by user ID
export const findSitterByUserId = async (userId: string) => {
    const sitter = await db
        .select()
        .from(petSitterTable)
        .where(eq(petSitterTable.userId, userId))
        .limit(1);
    return sitter[0] ?? null;
};

// Create new sitter
export const createSitter = async (data: Omit<NewPetSitter, 'verified' | 'averageRating' | 'totalReviews'>) => {
    const [sitter] = await db
        .insert(petSitterTable)
        .values({
            ...data,
            averageRating: 0,
            totalReviews: 0,
            updatedAt: new Date(),
        })
        .returning();
    return sitter;
};

// Find owner by user ID
export const findOwnerByUserId = async (userId: string) => {
    const owner = await db
        .select()
        .from(petOwnerTable)
        .where(eq(petOwnerTable.userId, userId))
        .limit(1);
    return owner[0] ?? null;
};

// Update owner's isSitter flag to true
export const updateOwnerIsSitter = async (userId: string) => {
    await db
        .update(petOwnerTable)
        .set({ isSitter: true })
        .where(eq(petOwnerTable.userId, userId));
};
