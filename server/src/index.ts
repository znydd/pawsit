import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "@/lib/auth";
import { sessionMiddleware, type AuthVariables } from "@/middleware/auth.middleware";
import { apiRoutes } from "@/routes";
import { errorHandler } from "./middleware/error.middleware";

const app = new Hono<{
  Variables: AuthVariables;
}>();

app.use(
  "/api/*",
  cors({
    origin: "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Session middleware - attaches user/session to all requests
app.use("*", sessionMiddleware);

// Better Auth routes
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// Session check endpoint
app.get("/api/session", (c) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user) {
    return c.json({ success: false, message: "Not authenticated" }, 401);
  }

  return c.json({ success: true, session, user });
});

app.use("*", errorHandler);
app.route("/api", apiRoutes);

export default app;