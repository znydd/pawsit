import { db } from "@/db";
import { bookingTable, petSitterTable, petOwnerTable, serviceTable } from "shared/src/db/schema";
import { eq, and } from "drizzle-orm";
import type { NewBooking } from "shared/src";

// Create new booking request
export const createBooking = async (data: NewBooking) => {
    const [booking] = await db
        .insert(bookingTable)
        .values({
            ...data,
            isAccepted: false,
            updatedAt: new Date(),
        })
        .returning();
    return booking;
};

// Find booking by ID (for accept/delete operations)
export const findBookingById = async (bookingId: number) => {
    const booking = await db
        .select({
            id: bookingTable.id,
            sitterId: bookingTable.sitterId,
            ownerId: bookingTable.ownerId,
            serviceId: bookingTable.serviceId,
            totalPrice: bookingTable.totalPrice,
            isAccepted: bookingTable.isAccepted,
            sitterUserId: petSitterTable.userId,
            ownerUserId: petOwnerTable.userId,
        })
        .from(bookingTable)
        .leftJoin(petSitterTable, eq(bookingTable.sitterId, petSitterTable.id))
        .leftJoin(petOwnerTable, eq(bookingTable.ownerId, petOwnerTable.id))
        .where(eq(bookingTable.id, bookingId))
        .limit(1);
    return booking[0] ?? null;
};

// Find all bookings for an owner with details
export const findBookingsByOwnerId = async (ownerId: number, statusFilter?: 'pending' | 'accepted') => {
    let whereCondition = eq(bookingTable.ownerId, ownerId);
    
    if (statusFilter === 'pending') {
        whereCondition = and(eq(bookingTable.ownerId, ownerId), eq(bookingTable.isAccepted, false))!;
    } else if (statusFilter === 'accepted') {
        whereCondition = and(eq(bookingTable.ownerId, ownerId), eq(bookingTable.isAccepted, true))!;
    }

    const bookings = await db
        .select({
            id: bookingTable.id,
            sitterId: bookingTable.sitterId,
            ownerId: bookingTable.ownerId,
            serviceId: bookingTable.serviceId,
            isAccepted: bookingTable.isAccepted,
            totalPrice: bookingTable.totalPrice,
            specialRequest: bookingTable.specialRequest,
            bookingCode: bookingTable.bookingCode,
            createdAt: bookingTable.createdAt,
            updatedAt: bookingTable.updatedAt,
            // Sitter details
            sitterName: petSitterTable.displayName,
            sitterImage: petSitterTable.displayImage,
            sitterHeadline: petSitterTable.headline,
            sitterArea: petSitterTable.area,
            sitterAddress: petSitterTable.address,
            sitterRating: petSitterTable.averageRating,
            // Service details
            serviceType: serviceTable.serviceType,
            pricePerDay: serviceTable.pricePerDay,
        })
        .from(bookingTable)
        .leftJoin(petSitterTable, eq(bookingTable.sitterId, petSitterTable.id))
        .leftJoin(serviceTable, eq(bookingTable.serviceId, serviceTable.id))
        .where(whereCondition);

    return bookings;
};

// Find all bookings for a sitter with details
export const findBookingsBySitterId = async (sitterId: number, statusFilter?: 'pending' | 'accepted') => {
    let whereCondition = eq(bookingTable.sitterId, sitterId);
    
    if (statusFilter === 'pending') {
        whereCondition = and(eq(bookingTable.sitterId, sitterId), eq(bookingTable.isAccepted, false))!;
    } else if (statusFilter === 'accepted') {
        whereCondition = and(eq(bookingTable.sitterId, sitterId), eq(bookingTable.isAccepted, true))!;
    }

    const bookings = await db
        .select({
            id: bookingTable.id,
            sitterId: bookingTable.sitterId,
            ownerId: bookingTable.ownerId,
            serviceId: bookingTable.serviceId,
            isAccepted: bookingTable.isAccepted,
            totalPrice: bookingTable.totalPrice,
            specialRequest: bookingTable.specialRequest,
            bookingCode: bookingTable.bookingCode,
            createdAt: bookingTable.createdAt,
            updatedAt: bookingTable.updatedAt,
            // Owner details
            ownerName: petOwnerTable.displayName,
            ownerImage: petOwnerTable.displayImage,
            ownerArea: petOwnerTable.area,
            ownerAddress: petOwnerTable.address,
            // Service details
            serviceType: serviceTable.serviceType,
            pricePerDay: serviceTable.pricePerDay,
        })
        .from(bookingTable)
        .leftJoin(petOwnerTable, eq(bookingTable.ownerId, petOwnerTable.id))
        .leftJoin(serviceTable, eq(bookingTable.serviceId, serviceTable.id))
        .where(whereCondition);

    return bookings;
};

// Update booking status to accepted
export const updateBookingStatus = async (bookingId: number) => {
    const [booking] = await db
        .update(bookingTable)
        .set({
            isAccepted: true,
            updatedAt: new Date(),
        })
        .where(eq(bookingTable.id, bookingId))
        .returning();
    return booking;
};

// Delete booking (only if pending)
export const deleteBooking = async (bookingId: number) => {
    const [deleted] = await db
        .delete(bookingTable)
        .where(eq(bookingTable.id, bookingId))
        .returning();
    return deleted;
};
