import { db } from "@/db";
import { petOwnerTable } from "shared/src/db/schema";
import { eq } from "drizzle-orm";
import type { NewPetOwner } from "shared";


export const findOwnerById = async (userId: string) => {
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