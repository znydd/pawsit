import type { Context, Next } from "hono";
export async function errorHandler(c: Context, next: Next) {
    try {
        await next();
    } catch (error) {
        console.error("Unhandled error:", error);
        return c.json(
            { success: false, message: "Internal server error" },
            500
        );
    }
}