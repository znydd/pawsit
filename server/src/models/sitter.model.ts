import { db } from "@/db";
import { petSitterTable, petOwnerTable, serviceTable, sitterAvailabilityTable, bookingTable, sitterPhotoTable } from "shared/src/db/schema";
import { eq, sql, and, ne, notExists } from "drizzle-orm";
import type { NewPetSitter, NewService, NewSitterAvailability, NewSitterPhoto } from "shared/src";

// Find sitter by user ID
export const findSitterByUserId = async (userId: string) => {
    const sitter = await db
        .select()
        .from(petSitterTable)
        .where(eq(petSitterTable.userId, userId))
        .limit(1);
    return sitter[0] ?? null;
};

// Find sitter by ID
export const findSitterById = async (sitterId: number) => {
    const sitter = await db
        .select()
        .from(petSitterTable)
        .where(eq(petSitterTable.id, sitterId))
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

// Increment sitter's total reviews count
export const incrementSitterTotalReviews = async (sitterId: number) => {
    const [updated] = await db
        .update(petSitterTable)
        .set({
            totalReviews: sql`${petSitterTable.totalReviews} + 1`,
            updatedAt: new Date(),
        })
        .where(eq(petSitterTable.id, sitterId))
        .returning();
    return updated;
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

// Update sitter profile
export const updateSitterProfile = async (
    userId: string,
    data: Partial<Pick<NewPetSitter, 'displayName' | 'displayImage' | 'phoneNumber' | 'headline' | 'bio' | 'address' | 'area' | 'experienceYears' | 'acceptsLargeDogs' | 'acceptsSmallDogs' | 'acceptsCats' | 'acceptsFish' | 'acceptsBirds' | 'acceptsOtherPets'>>
) => {
    const [sitter] = await db
        .update(petSitterTable)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(petSitterTable.userId, userId))
        .returning();
    return sitter ?? null;
};
 
// Create sitter photo record
export const createSitterPhoto = async (data: NewSitterPhoto) => {
    const [photo] = await db
        .insert(sitterPhotoTable)
        .values({
            ...data,
            updatedAt: new Date(),
        })
        .returning();
    return photo;
};

// Get all photos for a sitter
export const getSitterPhotosBySitterId = async (sitterId: number) => {
    const photos = await db
        .select()
        .from(sitterPhotoTable)
        .where(eq(sitterPhotoTable.sitterId, sitterId))
        .orderBy(sitterPhotoTable.createdAt);
    return photos;
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

        // Exclude sitters who already have a booking from this owner
        filters.push(
            notExists(
                db.select()
                    .from(bookingTable)
                    .innerJoin(petOwnerTable, eq(bookingTable.ownerId, petOwnerTable.id))
                    .where(
                        and(
                            eq(bookingTable.sitterId, petSitterTable.id),
                            eq(petOwnerTable.userId, excludeUserId)
                        )
                    )
            )
        );
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
            area: petSitterTable.area,
            location: petSitterTable.location,
            distance: sql<number>`ST_Distance(${petSitterTable.location}, ${centerPoint})`,
            // From service table
            serviceId: serviceTable.id,
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

// Find sitters by area (manual search)
export const findSittersByArea = async (
    area: string,
    excludeUserId?: string
) => {
    const filters = [
        sql`LOWER(${petSitterTable.area}) LIKE LOWER(${'%' + area + '%'})`,
        eq(sitterAvailabilityTable.isAvailable, true) // Only available sitters
    ];

    if (excludeUserId) {
        filters.push(ne(petSitterTable.userId, excludeUserId));

        // Exclude sitters who already have a booking from this owner
        filters.push(
            notExists(
                db.select()
                    .from(bookingTable)
                    .innerJoin(petOwnerTable, eq(bookingTable.ownerId, petOwnerTable.id))
                    .where(
                        and(
                            eq(bookingTable.sitterId, petSitterTable.id),
                            eq(petOwnerTable.userId, excludeUserId)
                        )
                    )
            )
        );
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
            area: petSitterTable.area,
            location: petSitterTable.location,
            // From service table
            serviceId: serviceTable.id,
            pricePerDay: serviceTable.pricePerDay,
            serviceType: serviceTable.serviceType,
            // From availability table
            isAvailable: sitterAvailabilityTable.isAvailable,
        })
        .from(petSitterTable)
        .leftJoin(serviceTable, eq(petSitterTable.id, serviceTable.sitterId))
        .leftJoin(sitterAvailabilityTable, eq(petSitterTable.id, sitterAvailabilityTable.sitterId))
        .where(and(...filters))
        .orderBy(petSitterTable.averageRating);

    return sitters;
};