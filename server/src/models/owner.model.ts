import { db } from "@/db";
import { user } from "@/db/auth.schema";
import { eq } from "drizzle-orm";


export const findOwnerById = async (userId: string) => {
    const owner = await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);
    return owner[0] ?? null;
}