import { Hono } from "hono";
import { streamService } from "@/services/stream.service";
import type { AuthVariables } from "@/middleware/auth.middleware";

const chatRoutes = new Hono<{ Variables: AuthVariables }>();

chatRoutes.get("/token", async (c) => {
    const user = c.get("user");
    if (!user) {
        return c.json({ success: false, message: "Not authenticated" }, 401);
    }

    try {
        const token = streamService.createToken(user.id);
        
        // Also sync the user to Stream if they don't exist
        // Note: In a real app, you might want to do this on profile update/signup
        // but for simplicity, we can do it here if we have the profile data.
        
        return c.json({
            success: true,
            token,
        });
    } catch (error) {
        console.error("Stream token error:", error);
        return c.json({ success: false, message: "Internal server error" }, 500);
    }
});

export { chatRoutes };
