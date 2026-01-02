import type { Context } from "hono";
import { findOwnerByUserId } from "@/models/owner.model";
import { findSitterByUserId } from "@/models/sitter.model";
import { findBookingById, deleteBooking } from "@/models/booking.model";
import { incrementSitterTotalReviews } from "@/models/sitter.model";
import { 
    createReview, 
    findReviewsBySitterId, 
    updateReviewReply,
    findReviewById
} from "@/models/review.model";
import { streamService } from "@/services/stream.service";

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
        await deleteBooking(bookingId);
        await incrementSitterTotalReviews(booking.sitterId);
        // Remove chat channel associated with this booking
        try {
            await streamService.deleteChannel(bookingId);
        } catch (error) {
            console.error("Failed to delete Stream channel:", error);
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
    return c.json({ success: true, message: "Reply submitted", review: updatedReview });
};
