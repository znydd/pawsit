import type { Context } from "hono";
import { findOwnerByUserId, createOwner } from "@/models/owner.model";


export const getOwnerProfile = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    const owner = await findOwnerByUserId(user.id);
    if (!owner) {
        return c.json({ success: false, message: "Owner not found" }, 404);
    }

    return c.json({ success: true, owner });
}


export const createOwnerProfile = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    try {
        const body = await c.req.json();
        const newOwner = await createOwner({
            displayName: body.displayName,
            displayImage: body.displayImage,
            userId: user.id,
            location: body.location
                ? { x: body.location.longitude, y: body.location.latitude }
                : { x: 0, y: 0 }, // Default location
        });

        return c.json(
            {
                success: true,
                message: "Owner created successfully",
                owner: newOwner,
            },
            201
        );
    } catch (error) {
        console.error("Create owner error:", error);
        return c.json(
            { success: false, message: "Internal server error" },
            500
        );
    }
}

