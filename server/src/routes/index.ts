import { Hono } from "hono";
import { authGuard } from "@/middleware/auth.middleware";
import { ownerRoutes } from "./owner.routes";
import { sitterRoutes } from "./sitter.routes";
import { uploadRoutes } from "./upload.routes";

const apiRoutes = new Hono();

// Health check
apiRoutes.get("/health", (c) => c.json({ status: "ok" }));

// Upload routes
apiRoutes.use("/upload/*", authGuard);
apiRoutes.route("/upload", uploadRoutes);

// Owner routes
apiRoutes.use("/owners/*", authGuard);
apiRoutes.route("/owners", ownerRoutes);

// Sitter routes
apiRoutes.use("/sitters/*", authGuard);
apiRoutes.route("/sitters", sitterRoutes);

export { apiRoutes };
