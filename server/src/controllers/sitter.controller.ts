import type { Context } from "hono";
import {
    createSitter,
    findSitterByUserId,
    findOwnerByUserId,
    getDashboardStats,
    getBookingsBySitterId,
    getServicesBySitterId,
    getReviewsBySitterId,
    getEarningsBySitterId
} from "@/models/sitter.model";

export const createSitterProfile = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    // Check if already a sitter
    const existingSitter = await findSitterByUserId(user.id);
    if (existingSitter) {
        return c.json({ success: false, message: "Already registered as sitter" }, 400);
    }

    // Get owner data (name, email, phone) from pet_owner table
    const owner = await findOwnerByUserId(user.id);
    if (!owner) {
        return c.json({ success: false, message: "Owner profile not found" }, 404);
    }

    // Additional required fields from request body
    const body = await c.req.json();
    const { headline, address, city, latitude, longitude, nidImage } = body;

    // Create sitter profile
    const sitter = await createSitter({
        userId: user.id,
        displayName: owner.displayName,
        phoneNumber: owner.phoneNumber,
        headline,
        address,
        city,
        latitude,
        longitude,
        nidImage,
    });

    return c.json({ success: true, sitter }, 201);
};

// Get dashboard overview
export const getSitterDashboard = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const sitter = await findSitterByUserId(user.id);
    if (!sitter) {
        return c.json({ success: false, message: "Sitter profile not found" }, 404);
    }

    const stats = await getDashboardStats(sitter.id);

    return c.json({
        success: true,
        dashboard: {
            profile: {
                id: sitter.id,
                displayName: sitter.displayName,
                displayImage: sitter.displayImage,
                headline: sitter.headline,
                verified: sitter.verified,
                averageRating: sitter.averageRating,
                totalReviews: sitter.totalReviews,
            },
            stats,
        },
    });
};

// Get all bookings for sitter
export const getSitterBookings = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const sitter = await findSitterByUserId(user.id);
    if (!sitter) {
        return c.json({ success: false, message: "Sitter profile not found" }, 404);
    }

    const bookings = await getBookingsBySitterId(sitter.id);

    return c.json({ success: true, bookings });
};

// Get all services for sitter
export const getSitterServices = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const sitter = await findSitterByUserId(user.id);
    if (!sitter) {
        return c.json({ success: false, message: "Sitter profile not found" }, 404);
    }

    const services = await getServicesBySitterId(sitter.id);

    return c.json({ success: true, services });
};

// Get all reviews for sitter
export const getSitterReviews = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const sitter = await findSitterByUserId(user.id);
    if (!sitter) {
        return c.json({ success: false, message: "Sitter profile not found" }, 404);
    }

    const reviews = await getReviewsBySitterId(sitter.id);

    return c.json({ success: true, reviews });
};

// Get earnings summary for sitter
export const getSitterEarnings = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const sitter = await findSitterByUserId(user.id);
    if (!sitter) {
        return c.json({ success: false, message: "Sitter profile not found" }, 404);
    }

    const earnings = await getEarningsBySitterId(sitter.id);

    return c.json({ success: true, earnings });
};