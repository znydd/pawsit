import type { Context } from "hono";
import {
    createBooking,
    findBookingsByOwnerId,
    findBookingsBySitterId,
    findBookingById,
    updateBookingStatus,
    deleteBooking,
} from "@/models/booking.model";
import { findOwnerByUserId } from "@/models/owner.model";
import { findSitterByUserId, findServicesBySitterId } from "@/models/sitter.model";

// Generate unique booking code
const generateBookingCode = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `BK${timestamp}${random}`;
};

// Create booking request (owner sends request to sitter)
export const createBookingRequest = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    // Verify user is an owner
    const owner = await findOwnerByUserId(user.id);
    if (!owner) {
        return c.json({ success: false, message: "Owner profile not found" }, 404);
    }

    const body = await c.req.json();
    const { sitterId, serviceId, totalPrice, specialRequest } = body;

    // Validate required fields
    if (!sitterId || !serviceId || !totalPrice) {
        return c.json({
            success: false,
            message: "Missing required fields: sitterId, serviceId, totalPrice",
        }, 400);
    }

    // Validate sitter exists
    const sitterServices = await findServicesBySitterId(sitterId);
    if (sitterServices.length === 0) {
        return c.json({ success: false, message: "Sitter not found" }, 404);
    }

    // Generate booking code
    const bookingCode = generateBookingCode();

    try {
        const booking = await createBooking({
            sitterId,
            ownerId: owner.id,
            serviceId,
            totalPrice,
            specialRequest: specialRequest ?? null,
            bookingCode,
        });

        return c.json({
            success: true,
            message: "Booking request created successfully",
            booking,
        }, 201);
    } catch (error) {
        console.error("Create booking error:", error);
        return c.json({ success: false, message: "Internal server error" }, 500);
    }
};

// Get owner's bookings (pending and accepted)
export const getOwnerBookings = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const owner = await findOwnerByUserId(user.id);
    if (!owner) {
        return c.json({ success: false, message: "Owner profile not found" }, 404);
    }

    // Get status filter from query params
    const status = c.req.query("status") as 'pending' | 'accepted' | undefined;

    try {
        const bookings = await findBookingsByOwnerId(owner.id, status);
        return c.json({
            success: true,
            bookings,
        });
    } catch (error) {
        console.error("Get owner bookings error:", error);
        return c.json({ success: false, message: "Internal server error" }, 500);
    }
};

// Get sitter's bookings (incoming requests and accepted bookings)
export const getSitterBookings = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const sitter = await findSitterByUserId(user.id);
    if (!sitter) {
        return c.json({ success: false, message: "Sitter profile not found" }, 404);
    }

    // Get status filter from query params
    const status = c.req.query("status") as 'pending' | 'accepted' | undefined;

    try {
        const bookings = await findBookingsBySitterId(sitter.id, status);
        return c.json({
            success: true,
            bookings,
        });
    } catch (error) {
        console.error("Get sitter bookings error:", error);
        return c.json({ success: false, message: "Internal server error" }, 500);
    }
};

// Accept booking request (sitter accepts)
export const acceptBookingRequest = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const sitter = await findSitterByUserId(user.id);
    if (!sitter) {
        return c.json({ success: false, message: "Sitter profile not found" }, 404);
    }

    const bookingIdStr = c.req.param("id");
    const bookingId = parseInt(bookingIdStr);

    if (isNaN(bookingId)) {
        return c.json({ success: false, message: "Invalid booking ID" }, 400);
    }

    try {
        // Find the booking
        const booking = await findBookingById(bookingId);
        if (!booking) {
            return c.json({ success: false, message: "Booking not found" }, 404);
        }

        // Verify booking belongs to this sitter
        if (booking.sitterId !== sitter.id) {
            return c.json({
                success: false,
                message: "You are not authorized to accept this booking",
            }, 403);
        }

        // Check if already accepted
        if (booking.isAccepted) {
            return c.json({
                success: false,
                message: "Booking is already accepted",
            }, 400);
        }

        // Update booking status
        const updatedBooking = await updateBookingStatus(bookingId);

        return c.json({
            success: true,
            message: "Booking accepted successfully",
            booking: updatedBooking,
        });
    } catch (error) {
        console.error("Accept booking error:", error);
        return c.json({ success: false, message: "Internal server error" }, 500);
    }
};

// Delete booking request (owner deletes pending request)
export const deleteBookingRequest = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const owner = await findOwnerByUserId(user.id);
    if (!owner) {
        return c.json({ success: false, message: "Owner profile not found" }, 404);
    }

    const bookingIdStr = c.req.param("id");
    const bookingId = parseInt(bookingIdStr);

    if (isNaN(bookingId)) {
        return c.json({ success: false, message: "Invalid booking ID" }, 400);
    }

    try {
        // Find the booking
        const booking = await findBookingById(bookingId);
        if (!booking) {
            return c.json({ success: false, message: "Booking not found" }, 404);
        }

        // Verify booking belongs to this owner
        if (booking.ownerId !== owner.id) {
            return c.json({
                success: false,
                message: "You are not authorized to delete this booking",
            }, 403);
        }

        // Check if booking is accepted (cannot delete accepted bookings)
        if (booking.isAccepted) {
            return c.json({
                success: false,
                message: "Cannot delete accepted booking",
            }, 400);
        }

        // Delete the booking
        await deleteBooking(bookingId);

        return c.json({
            success: true,
            message: "Booking deleted successfully",
        });
    } catch (error) {
        console.error("Delete booking error:", error);
        return c.json({ success: false, message: "Internal server error" }, 500);
    }
};
