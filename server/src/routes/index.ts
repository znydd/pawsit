import { Hono } from "hono";
import { authGuard } from "@/middleware/auth.middleware";

// Import route modules (uncomment as you create them)
// import { sitterRoutes } from "./sitter.routes";
// import { ownerRoutes } from "./owner.routes";
// import { bookingRoutes } from "./booking.routes";
// import { serviceRoutes } from "./service.routes";
// import { reviewRoutes } from "./review.routes";

const apiRoutes = new Hono();

// Health check
apiRoutes.get("/health", (c) => c.json({ status: "ok" }));

// ========== PUBLIC ROUTES ==========
// apiRoutes.route("/sitters", sitterRoutes);
// apiRoutes.route("/services", serviceRoutes);

// ========== PROTECTED ROUTES ==========
// Apply authGuard to all routes under these paths
// apiRoutes.use("/owners/*", authGuard);
// apiRoutes.route("/owners", ownerRoutes);

// apiRoutes.use("/bookings/*", authGuard);
// apiRoutes.route("/bookings", bookingRoutes);

// apiRoutes.use("/reviews/*", authGuard);
// apiRoutes.route("/reviews", reviewRoutes);

export { apiRoutes };
