import type { Context } from "hono";
import {
    createSitter,
    findSitterByUserId,
    findServicesBySitterId,
    createServiceRecord,
    updateServiceRecord,
    createSitterAvailability,
    findSittersInRadius,
    patchSitterAvailability
} from "@/models/sitter.model";
import { findOwnerByUserId, updateOwnerIsSitter } from "@/models/owner.model";

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
        location,
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
        location,
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

        // Initialize default service: house_sitting, price 100
        await createServiceRecord({
            sitterId: sitter.id,
            serviceType: "house_sitting",
            pricePerDay: 100,
            isActive: true,
        });

        // Initialize sitter availability: isAvailable true, isBanned false
        await createSitterAvailability({
            sitterId: sitter.id,
            isAvailable: true,
            isBanned: false,
        });

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
            location: sitter.location,
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

// Update an existing service (PATCH)
export const updateSitterService = async (c: Context) => {
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

    // Get the sitter's service (created during registration)
    const services = await findServicesBySitterId(sitter.id);
    if (services.length === 0) {
        return c.json({ success: false, message: "Service not found" }, 404);
    }
    const existingService = services[0]!;

    const body = await c.req.json();
    const { serviceType, pricePerDay, isActive } = body;

    // Validate serviceType if provided
    if (serviceType !== undefined && !SERVICE_TYPES.includes(serviceType)) {
        return c.json({
            success: false,
            message: `Invalid service type. Must be one of: ${SERVICE_TYPES.join(", ")}`,
        }, 400);
    }

    // Validate pricePerDay if provided
    if (pricePerDay !== undefined && (typeof pricePerDay !== "number" || pricePerDay < 0)) {
        return c.json({ success: false, message: "Price must be a positive number" }, 400);
    }

    const service = await updateServiceRecord(existingService.id, {
        serviceType,
        pricePerDay,
        isActive,
    });

    if (service) {
        return c.json({ success: true, service }, 200);
    } else {
        return c.json({ success: false, message: "Failed to update service" }, 500);
    }
};

// Find sitters in radius
export const getSittersInRadius = async (c: Context) => {
    const user = c.get("user");
    console.log(user);
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const latStr = c.req.query("lat");
    const lngStr = c.req.query("lng");
    const radiusStr = c.req.query("radius");
    console.log(latStr, lngStr, radiusStr);

    if (!latStr || !lngStr) {
        return c.json({
            success: false,
            message: "Missing required query parameters: lat, lng",
        }, 400);
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const radius = radiusStr ? parseFloat(radiusStr) : 5000;

    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
        return c.json({
            success: false,
            message: "Invalid query parameters: lat, lng, and radius must be numbers",
        }, 400);
    }

    const sitters = await findSittersInRadius(lat, lng, radius, user.id);
    console.log(sitters);

    return c.json({
        success: true,
        sitters,
    });
};


// Update sitter availability (PATCH)
export const updateSitterAvailability= async (c: Context) => {
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
    const { isAvailable } = body;

    if (isAvailable === undefined) {
        return c.json({
            success: false,
            message: "Missing required field: isAvailable",
        }, 400);
    }

    if (typeof isAvailable !== "boolean") {
        return c.json({
            success: false,
            message: "isAvailable must be a boolean",
        }, 400);
    }

    const availability = await patchSitterAvailability(sitter.id, { isAvailable });

    if (availability) {
        return c.json({ success: true, availability }, 200);
    } else {
        return c.json({ success: false, message: "Failed to update availability" }, 500);
    }
};
