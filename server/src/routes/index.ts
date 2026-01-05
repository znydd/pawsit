import { Hono } from "hono";
import { authGuard } from "@/middleware/auth.middleware";
import { ownerRoutes } from "./owner.routes";
import { sitterRoutes } from "./sitter.routes";
import { uploadRoutes } from "./upload.routes";
import { bookingRoutes } from "./booking.routes";
import { chatRoutes } from "./chat.routes";
import reviewRoutes from "./review.routes";
import { userRoutes } from "./user.routes";
import notificationRoutes from "./notification.routes";

const apiRoutes = new Hono();

// Health check
apiRoutes.get("/health", (c) => c.json({ status: "ok" }));

// Chat routes
apiRoutes.use("/chat/*", authGuard);
apiRoutes.route("/chat", chatRoutes);

// Upload routes
apiRoutes.use("/upload/*", authGuard);
apiRoutes.route("/upload", uploadRoutes);

// Owner routes
apiRoutes.use("/owners/*", authGuard);
apiRoutes.route("/owners", ownerRoutes);

// Sitter routes
apiRoutes.use("/sitters/*", authGuard);
apiRoutes.route("/sitters", sitterRoutes);

apiRoutes.use("/bookings/*", authGuard);
apiRoutes.route("/bookings", bookingRoutes);

// Review routes
apiRoutes.use("/reviews/*", authGuard);
apiRoutes.route("/reviews", reviewRoutes);

// User routes
apiRoutes.use("/users/*", authGuard);
apiRoutes.route("/users", userRoutes);

// Notification routes
apiRoutes.use("/notifications/*", authGuard);
apiRoutes.route("/notifications", notificationRoutes);

export { apiRoutes };

