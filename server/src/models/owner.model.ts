import { db } from "@/db";
import { petOwnerTable } from "shared/src/db/schema";
import { eq } from "drizzle-orm";
import type { NewPetOwner } from "shared";


export const findOwnerByUserId = async (userId: string) => {
    const owner = await db
        .select()
        .from(petOwnerTable)
        .where(eq(petOwnerTable.userId, userId))
        .limit(1);
    return owner[0] ?? null;
}

export const createOwner = async (newOwnerData: NewPetOwner) => {
    const newOwner = await db
        .insert(petOwnerTable)
        .values(newOwnerData)
        .returning();
    return newOwner[0] ?? null;
}

// Update owner's isSitter flag to true
export const updateOwnerIsSitter = async (userId: string) => {
    await db
        .update(petOwnerTable)
        .set({ isSitter: true })
        .where(eq(petOwnerTable.userId, userId));
};

// Update owner profile
export const updateOwnerProfile = async (
    userId: string,
    data: Partial<Pick<NewPetOwner, 'displayName' | 'displayImage' | 'phoneNumber' | 'bio' | 'address' | 'area'>>
) => {
    const [owner] = await db
        .update(petOwnerTable)
        .set({
            ...data,
        })
        .where(eq(petOwnerTable.userId, userId))
        .returning();
    return owner ?? null;
};