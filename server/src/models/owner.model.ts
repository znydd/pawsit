import { db } from "@/db";
import { petOwnerTable } from "shared/src/db/schema";
import { eq } from "drizzle-orm";


export const findOwnerById = async (userId: string) => {
    const owner = await db
        .select()
        .from(petOwnerTable)
        .where(eq(petOwnerTable.userId, userId))
        .limit(1);
    return owner[0] ?? null;
}

export const createOwner = async (userData: any) => {
    const newUser = await db
        .insert(petOwnerTable)
        .values(userData)
        .returning();
    return newUser[0] ?? null;
}