import type { Context } from "hono";
import { createSitter, findSitterByUserId, findOwnerByUserId, updateOwnerIsSitter, findServicesBySitterId, createServiceRecord } from "@/models/sitter.model";

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

export const SERVICE_TYPES = [
    "boarding",
    "daycare",
    "walking",
    "drop_in",
    "house_sitting",
] as const;

// Get all services for the authenticated sitter
export const getSitterServices = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }
    const sitter = await findSitterByUserId(user.id);
    if (!sitter) {
        return c.json({
            success: false,
            message: "Not registered as sitter",
            isRegistered: false,
        }, 404);
    }
    const services = await findServicesBySitterId(sitter.id);
    return c.json({
        success: true,
        isRegistered: true,
        services,
    });
};

// Create a new service
export const createSitterService = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }
    const sitter = await findSitterByUserId(user.id);
    if (!sitter) {
        return c.json({
            success: false,
            message: "Sitter profile not found. Please register as a sitter first.",
        }, 404);
    }
    const body = await c.req.json();
    const { name, serviceType, description, pricePerDay, isActive } = body;
    if (!name || !serviceType || !description || pricePerDay === undefined) {
        return c.json({
            success: false,
            message: "Missing required fields: name, serviceType, description, pricePerDay",
        }, 400);
    }
    if (!SERVICE_TYPES.includes(serviceType)) {
        return c.json({
            success: false,
            message: `Invalid service type. Must be one of: ${SERVICE_TYPES.join(", ")}`,
        }, 400);
    }
    if (typeof pricePerDay !== "number" || pricePerDay < 0) {
        return c.json({ success: false, message: "Price must be a positive number" }, 400);
    }
    const service = await createServiceRecord({
        sitterId: sitter.id,
        name,
        serviceType,
        description,
        pricePerDay,
        isActive: isActive ?? true,
    });
    if (service) {
        return c.json({ success: true, service }, 201);
    } else {
        return c.json({ success: false, message: "Failed to create service" }, 500);
    }
};
