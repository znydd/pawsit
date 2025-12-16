import { db } from "@/db";
import { petSitterTable, petOwnerTable, bookingTable, serviceTable, reviewTable, paymentTable } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";

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
export const createSitter = async (data: {
    userId: string;
    displayName: string | null;
    phoneNumber: string;
    headline: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    nidImage: string;
}) => {
    const [sitter] = await db
        .insert(petSitterTable)
        .values({
            userId: data.userId,
            displayName: data.displayName,
            phoneNumber: data.phoneNumber,
            headline: data.headline,
            address: data.address,
            city: data.city,
            latitude: data.latitude,
            longitude: data.longitude,
            nidImage: data.nidImage,
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

// Dashboard stats
export const getDashboardStats = async (sitterId: number) => {
    // Get booking counts by status
    const bookingStats = await db
        .select({
            totalBookings: sql<number>`count(*)`,
            pendingBookings: sql<number>`count(*) filter (where ${bookingTable.status} = 'pending')`,
            confirmedBookings: sql<number>`count(*) filter (where ${bookingTable.status} = 'confirmed')`,
            completedBookings: sql<number>`count(*) filter (where ${bookingTable.status} = 'completed')`,
            cancelledBookings: sql<number>`count(*) filter (where ${bookingTable.status} = 'cancelled')`,
        })
        .from(bookingTable)
        .where(eq(bookingTable.sitterId, sitterId));

    // Get total earnings from completed payments
    const earningsResult = await db
        .select({
            totalEarnings: sql<number>`coalesce(sum(${paymentTable.amount}), 0)`,
        })
        .from(paymentTable)
        .innerJoin(bookingTable, eq(paymentTable.bookingId, bookingTable.id))
        .where(eq(bookingTable.sitterId, sitterId));

    return {
        totalBookings: Number(bookingStats[0]?.totalBookings ?? 0),
        pendingBookings: Number(bookingStats[0]?.pendingBookings ?? 0),
        confirmedBookings: Number(bookingStats[0]?.confirmedBookings ?? 0),
        completedBookings: Number(bookingStats[0]?.completedBookings ?? 0),
        cancelledBookings: Number(bookingStats[0]?.cancelledBookings ?? 0),
        totalEarnings: Number(earningsResult[0]?.totalEarnings ?? 0),
    };
};

// Get all bookings for a sitter with owner and service info
export const getBookingsBySitterId = async (sitterId: number) => {
    const bookings = await db
        .select({
            id: bookingTable.id,
            startDate: bookingTable.startDate,
            endDate: bookingTable.endDate,
            status: bookingTable.status,
            totalPrice: bookingTable.totalPrice,
            specialRequest: bookingTable.specialRequest,
            bookingCode: bookingTable.bookingCode,
            createdAt: bookingTable.createdAt,
            ownerName: petOwnerTable.displayName,
            ownerImage: petOwnerTable.displayImage,
            serviceName: serviceTable.name,
            serviceType: serviceTable.serviceType,
        })
        .from(bookingTable)
        .innerJoin(petOwnerTable, eq(bookingTable.ownerId, petOwnerTable.id))
        .innerJoin(serviceTable, eq(bookingTable.serviceId, serviceTable.id))
        .where(eq(bookingTable.sitterId, sitterId))
        .orderBy(desc(bookingTable.createdAt));

    return bookings;
};

// Get all services for a sitter
export const getServicesBySitterId = async (sitterId: number) => {
    const services = await db
        .select()
        .from(serviceTable)
        .where(eq(serviceTable.sitterId, sitterId))
        .orderBy(desc(serviceTable.createdAt));

    return services;
};

// Get all reviews for a sitter with owner info
export const getReviewsBySitterId = async (sitterId: number) => {
    const reviews = await db
        .select({
            id: reviewTable.id,
            rating: reviewTable.rating,
            reviewText: reviewTable.reviewText,
            sitterResponse: reviewTable.sitterResponse,
            repliedAt: reviewTable.repliedAt,
            createdAt: reviewTable.createdAt,
            ownerName: petOwnerTable.displayName,
            ownerImage: petOwnerTable.displayImage,
        })
        .from(reviewTable)
        .innerJoin(petOwnerTable, eq(reviewTable.ownerId, petOwnerTable.id))
        .where(eq(reviewTable.sitterId, sitterId))
        .orderBy(desc(reviewTable.createdAt));

    return reviews;
};

// Get earnings summary for a sitter
export const getEarningsBySitterId = async (sitterId: number) => {
    // Total earnings
    const totalResult = await db
        .select({
            totalEarnings: sql<number>`coalesce(sum(${paymentTable.amount}), 0)`,
            totalPayments: sql<number>`count(*)`,
        })
        .from(paymentTable)
        .innerJoin(bookingTable, eq(paymentTable.bookingId, bookingTable.id))
        .where(eq(bookingTable.sitterId, sitterId));

    // Monthly breakdown (last 12 months)
    const monthlyResult = await db
        .select({
            month: sql<string>`to_char(${paymentTable.paidAt}, 'YYYY-MM')`,
            amount: sql<number>`sum(${paymentTable.amount})`,
            count: sql<number>`count(*)`,
        })
        .from(paymentTable)
        .innerJoin(bookingTable, eq(paymentTable.bookingId, bookingTable.id))
        .where(eq(bookingTable.sitterId, sitterId))
        .groupBy(sql`to_char(${paymentTable.paidAt}, 'YYYY-MM')`)
        .orderBy(desc(sql`to_char(${paymentTable.paidAt}, 'YYYY-MM')`))
        .limit(12);

    return {
        totalEarnings: Number(totalResult[0]?.totalEarnings ?? 0),
        totalPayments: Number(totalResult[0]?.totalPayments ?? 0),
        monthlyBreakdown: monthlyResult.map((row) => ({
            month: row.month,
            amount: Number(row.amount ?? 0),
            count: Number(row.count ?? 0),
        })),
    };
};