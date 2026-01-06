import type { Context } from "hono";
import { findOwnerByUserId, findOwnerById } from "@/models/owner.model";
import { findSitterByUserId, findSitterById, incrementSitterTotalReviews, updateSitterRating, addServiceEarning } from "@/models/sitter.model";
import { findBookingById, deleteBooking } from "@/models/booking.model";
import { 
    createReview, 
    findReviewsBySitterId, 
    updateReviewReply,
    findReviewById
} from "@/models/review.model";
import { streamService } from "@/services/stream.service";
import { createNotification } from "@/models/notification.model";

export const submitReview = async (c: Context) => {
    const user = c.get("user");
    const owner = await findOwnerByUserId(user.id);
    if (!owner) return c.json({ success: false, message: "Owner profile not found" }, 404);

    const { bookingId, rating, reviewText } = await c.req.json();
    const booking = await findBookingById(bookingId);

    if (!booking || booking.ownerId !== owner.id) {
        return c.json({ success: false, message: "Booking not found or unauthorized" }, 404);
    }

    if (!booking.isAccepted) {
        return c.json({ success: false, message: "You can only review accepted bookings" }, 400);
    }

    const review = await createReview({
        bookingId,
        ownerId: owner.id,
        sitterId: booking.sitterId,
        rating,
        reviewText,
    });

    if (review) {
        // Add earnings to service before deleting booking
        await addServiceEarning(booking.serviceId, booking.totalPrice);
        await deleteBooking(bookingId);
        await incrementSitterTotalReviews(booking.sitterId);
        await updateSitterRating(booking.sitterId);
        // Remove chat channel associated with this booking
        try {
            await streamService.deleteChannel(bookingId);
        } catch (error) {
            console.error("Failed to delete Stream channel:", error);
        }

        // Create notification for sitter
        try {
            const sitter = await findSitterById(booking.sitterId);
            if (sitter) {
                const ownerName = owner.displayName || "A pet owner";
                await createNotification({
                    userId: sitter.userId,
                    type: "review_received",
                    content: `${ownerName} left you a ${rating}-star review!`,
                });
            }
        } catch (notifError) {
            console.error("Failed to create notification:", notifError);
        }
    }

    return c.json({ success: true, message: "Review submitted", review }, 201);
};

export const getSitterReviews = async (c: Context) => {
    const user = c.get("user");
    const sitter = await findSitterByUserId(user.id);
    if (!sitter) return c.json({ success: false, message: "Sitter profile not found" }, 404);

    const reviews = await findReviewsBySitterId(sitter.id);
    return c.json({ success: true, reviews });
};

export const submitSitterReply = async (c: Context) => {
    const user = c.get("user");
    const sitter = await findSitterByUserId(user.id);
    if (!sitter) return c.json({ success: false, message: "Sitter profile not found" }, 404);

    const reviewId = parseInt(c.req.param("id"));
    const { response } = await c.req.json();
    const review = await findReviewById(reviewId);

    if (!review || review.sitterId !== sitter.id) {
        return c.json({ success: false, message: "Review not found or unauthorized" }, 404);
    }

    if (review.sitterResponse) {
        return c.json({ success: false, message: "Reply already exists" }, 400);
    }

    const updatedReview = await updateReviewReply(reviewId, sitter.id, response);

    // Create notification for owner with the reply content
    try {
        const owner = await findOwnerById(review.ownerId);
        if (owner) {
            const sitterName = sitter.displayName || "A sitter";
            // Truncate long replies for notification display
            const truncatedReply = response.length > 150 
                ? response.substring(0, 147) + "..." 
                : response;
            await createNotification({
                userId: owner.userId,
                type: "review_reply",
                content: `${sitterName} replied to your review: "${truncatedReply}"`,
            });
        }
    } catch (notifError) {
        console.error("Failed to create notification:", notifError);
    }

    return c.json({ success: true, message: "Reply submitted", review: updatedReview });
};

