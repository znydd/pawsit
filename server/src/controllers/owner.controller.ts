import type { Context } from "hono";
import { findOwnerById } from "@/models/owner.model";


export const getOwnerProfile = async (c: Context) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }
    console.log(user.id);

    const owner = await findOwnerById(user.id);
    if (!owner) {
        return c.json({ success: false, message: "Owner not found" }, 404);
    }

    return c.json({ success: true, owner });
}