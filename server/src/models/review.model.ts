import { db } from "@/db";
import { reviewTable, bookingTable, petSitterTable, petOwnerTable } from "shared/src/db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { NewReview } from "shared/src";

// Create a new review
export const createReview = async (data: NewReview) => {
    const [review] = await db
        .insert(reviewTable)
        .values({
            ...data,
            updatedAt: new Date(),
        })
        .returning();
    return review;
};

// Get reviews for a sitter
export const findReviewsBySitterId = async (sitterId: number) => {
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
        .leftJoin(petOwnerTable, eq(reviewTable.ownerId, petOwnerTable.id))
        .where(eq(reviewTable.sitterId, sitterId))
        .orderBy(sql`${reviewTable.createdAt} DESC`);

    return reviews;
};

// Add sitter reply
export const updateReviewReply = async (reviewId: number, sitterId: number, response: string) => {
    const [updated] = await db
        .update(reviewTable)
        .set({
            sitterResponse: response,
            repliedAt: new Date(),
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(reviewTable.id, reviewId),
                eq(reviewTable.sitterId, sitterId)
            )
        )
        .returning();
    return updated;
};

// Find review by ID
export const findReviewById = async (id: number) => {
    const [review] = await db
        .select()
        .from(reviewTable)
        .where(eq(reviewTable.id, id))
        .limit(1);
    return review;
};
