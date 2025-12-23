import { db } from "@/db";
import { petSitterTable, petOwnerTable, sitterAvailabilityTable } from "shared/src/db/schema";
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

// Find sitter availability
export const findSitterAvailability = async (sitterId: number) => {
    const availability = await db
        .select()
        .from(sitterAvailabilityTable)
        .where(eq(sitterAvailabilityTable.sitterId, sitterId))
        .limit(1);
    return availability[0] ?? null;
};

// Update or add sitter availability
export const upsertSitterAvailability = async (sitterId: number, isBlocked: boolean) => {
    const existing = await findSitterAvailability(sitterId);

    if (existing) {
        const [updated] = await db
            .update(sitterAvailabilityTable)
            .set({ isBlocked, updatedAt: new Date() })
            .where(eq(sitterAvailabilityTable.sitterId, sitterId))
            .returning();
        return updated;
    }

    const [inserted] = await db
        .insert(sitterAvailabilityTable)
        .values({
            sitterId,
            isBlocked,
            updatedAt: new Date(),
        })
        .returning();
    return inserted;
};
