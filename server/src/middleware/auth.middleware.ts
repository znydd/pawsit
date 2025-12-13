import type { Context, Next } from "hono";
import { auth } from "@/lib/auth";

export type AuthVariables = {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
};

/**
 * Session middleware - attaches user/session to context for all routes
 * Use this globally to make session available everywhere
 */
export async function sessionMiddleware(c: Context, next: Next) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        c.set("user", null);
        c.set("session", null);
        await next();
        return;
    }

    c.set("user", session.user);
    c.set("session", session.session);
    await next();
}

/**
 * Auth guard middleware - blocks unauthenticated requests
 * Use this for protected routes only
 */
export async function authGuard(c: Context, next: Next) {
    const user = c.get("user");

    if (!user) {
        return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    await next();
}
