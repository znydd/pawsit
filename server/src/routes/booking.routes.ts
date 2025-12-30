import { Hono } from "hono";
import {
    createBookingRequest,
    getOwnerBookings,
    getSitterBookings,
    acceptBookingRequest,
    deleteBookingRequest,
} from "@/controllers/booking.controller";

const bookingRoutes = new Hono();

// POST - Create booking request (owner)
bookingRoutes.post("/", createBookingRequest);

// GET - Get owner's bookings
bookingRoutes.get("/owner", getOwnerBookings);

// GET - Get sitter's bookings
bookingRoutes.get("/sitter", getSitterBookings);

// PATCH - Accept booking request (sitter)
bookingRoutes.patch("/:id/accept", acceptBookingRequest);

// DELETE - Delete booking request (owner)
bookingRoutes.delete("/:id", deleteBookingRequest);

export { bookingRoutes };
