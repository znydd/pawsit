import { db } from "@/db";
import { petSitterTable, petOwnerTable, serviceTable, sitterAvailabilityTable } from "shared/src/db/schema";
import { eq, sql, and, ne } from "drizzle-orm";
import type { NewPetSitter, NewService, NewSitterAvailability } from "shared/src";

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

// Update an existing service
export const updateServiceRecord = async (
    serviceId: number,
    data: Partial<Pick<NewService, 'serviceType' | 'pricePerDay' | 'isActive'>>
) => {
    const [service] = await db
        .update(serviceTable)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(serviceTable.id, serviceId))
        .returning();
    return service;
};

// Create sitter availability record
export const createSitterAvailability = async (data: NewSitterAvailability) => {
    const [availability] = await db
        .insert(sitterAvailabilityTable)
        .values({
            ...data,
            updatedAt: new Date(),
        })
        .returning();
    return availability;
};

// Update sitter availability
export const patchSitterAvailability = async (
    sitterId: number,
    data: Partial<Pick<NewSitterAvailability, 'isAvailable'>>
) => {
    const [availability] = await db
        .update(sitterAvailabilityTable)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(sitterAvailabilityTable.sitterId, sitterId))
        .returning();
    return availability;
};


// Find all services by sitter ID
export const findServicesBySitterId = async (sitterId: number) => {
    const services = await db
        .select()
        .from(serviceTable)
        .where(eq(serviceTable.sitterId, sitterId));
    return services;
};

// Find sitters within a specific radius (with JOINs for efficiency)
export const findSittersInRadius = async (
    lat: number,
    lng: number,
    radiusInMeters: number = 5000,
    excludeUserId?: string
    ) => {

    const centerPoint = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography`;
    const filters = [
        sql`ST_DWithin(${petSitterTable.location}, ${centerPoint}, ${radiusInMeters})`,
        eq(sitterAvailabilityTable.isAvailable, true) // Only available sitters
    ];

    if (excludeUserId) {
        filters.push(ne(petSitterTable.userId, excludeUserId));
    }

    const sitters = await db
        .select({
            id: petSitterTable.id,
            userId: petSitterTable.userId,
            displayName: petSitterTable.displayName,
            displayImage: petSitterTable.displayImage,
            headline: petSitterTable.headline,
            averageRating: petSitterTable.averageRating,
            totalReviews: petSitterTable.totalReviews,
            address: petSitterTable.address,
            city: petSitterTable.city,
            location: petSitterTable.location,
            distance: sql<number>`ST_Distance(${petSitterTable.location}, ${centerPoint})`,
            // From service table
            pricePerDay: serviceTable.pricePerDay,
            serviceType: serviceTable.serviceType,
            // From availability table
            isAvailable: sitterAvailabilityTable.isAvailable,
        })
        .from(petSitterTable)
        .leftJoin(serviceTable, eq(petSitterTable.id, serviceTable.sitterId))
        .leftJoin(sitterAvailabilityTable, eq(petSitterTable.id, sitterAvailabilityTable.sitterId))
        .where(and(...filters))
        .orderBy(sql`ST_Distance(${petSitterTable.location}, ${centerPoint})`);

    return sitters;
};