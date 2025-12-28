import { db } from "@/db";
import { petSitterTable, petOwnerTable, serviceTable } from "shared/src/db/schema";
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
// Type for creating a new service
export interface NewService {
    sitterId: number;
    name: string;
    serviceType: string;
    description: string;
    pricePerDay: number;
    isActive?: boolean;
}

// Create a new service
export const createServiceRecord = async (data: NewService) => {
    const [service] = await db
        .insert(serviceTable)
        .values({
            ...data,
            isActive: data.isActive ?? true,
            updatedAt: new Date(),
        })
        .returning();
    return service;
};
// Find all services by sitter ID
export const findServicesBySitterId = async (sitterId: number) => {
    const services = await db
        .select()
        .from(serviceTable)
        .where(eq(serviceTable.sitterId, sitterId));
    return services;
};
