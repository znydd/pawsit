import type { Context } from "hono";
import { createSitter, findSitterByUserId, findOwnerByUserId, updateOwnerIsSitter, upsertSitterAvailability, findSitterAvailability } from "@/models/sitter.model";

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

    // Get owner data from pet_owner table
    const owner = await findOwnerByUserId(user.id);
    if (!owner) {
        return c.json({ success: false, message: "Owner profile not found" }, 404);
    }

    // Get all required fields from request body
    const body = await c.req.json();
    const {
        phoneNumber,
        headline,
        bio,
        address,
        city,
        latitude,
        longitude,
        experienceYears,
        acceptsLargeDogs,
        acceptsSmallDogs,
        acceptsCats,
        acceptsFish,
        acceptsBirds,
        acceptsOtherPets,
        nidImage
    } = body;

    // Create sitter profile
    const sitter = await createSitter({
        userId: user.id,
        displayName: owner.displayName,
        displayImage: owner.displayImage,
        phoneNumber,
        headline,
        bio: bio ?? null,
        address,
        city,
        latitude,
        longitude,
        experienceYears: experienceYears ?? 0,
        acceptsLargeDogs: acceptsLargeDogs ?? false,
        acceptsSmallDogs: acceptsSmallDogs ?? false,
        acceptsCats: acceptsCats ?? false,
        acceptsFish: acceptsFish ?? false,
        acceptsBirds: acceptsBirds ?? false,
        acceptsOtherPets: acceptsOtherPets ?? false,
        nidImage,
    });

    // Update owner's isSitter flag to true
    if (sitter) {
        await updateOwnerIsSitter(user.id);
        return c.json({ success: true, sitter }, 201);
    } else {
        return c.json(
            { success: false, message: "Sitter profile not created" },
            500
        );
    }
};

// Get sitter profile
export const getSitterProfile = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const sitter = await findSitterByUserId(user.id);
    if (!sitter) {
        return c.json({ success: false, message: "Sitter profile not found" }, 404);
    }

    // Return sitter profile (excluding sensitive fields if needed)
    return c.json({
        success: true,
        sitter: {
            id: sitter.id,
            displayName: sitter.displayName,
            displayImage: sitter.displayImage,
            phoneNumber: sitter.phoneNumber,
            headline: sitter.headline,
            bio: sitter.bio,
            address: sitter.address,
            city: sitter.city,
            latitude: sitter.latitude,
            longitude: sitter.longitude,
            experienceYears: sitter.experienceYears,
            acceptsLargeDogs: sitter.acceptsLargeDogs,
            acceptsSmallDogs: sitter.acceptsSmallDogs,
            acceptsCats: sitter.acceptsCats,
            acceptsFish: sitter.acceptsFish,
            acceptsBirds: sitter.acceptsBirds,
            acceptsOtherPets: sitter.acceptsOtherPets,
            verified: sitter.verified,
            averageRating: sitter.averageRating,
            totalReviews: sitter.totalReviews,
        },
    });
};


// Update sitter availability (Toggle)
export const updateSitterAvailability = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const sitter = await findSitterByUserId(user.id);
    if (!sitter) {
        return c.json({ success: false, message: "Sitter profile not found" }, 404);
    }

    const { isBlocked } = await c.req.json();

    if (isBlocked === undefined) {
        return c.json({ success: false, message: "isBlocked status is required" }, 400);
    }

    const availability = await upsertSitterAvailability(sitter.id, isBlocked);

    return c.json({
        success: true,
        message: isBlocked ? "You are now UNAVAILABLE to take pets" : "You are now AVAILABLE to take pets",
        availability
    });
};

// Get sitter availability
export const getSitterAvailability = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const sitter = await findSitterByUserId(user.id);
    if (!sitter) {
        return c.json({ success: false, message: "Sitter profile not found" }, 404);
    }

    const availability = await findSitterAvailability(sitter.id);

    // Default to available if no record exists yet
    return c.json({
        success: true,
        availability: availability ?? { isBlocked: false }
    });
};
