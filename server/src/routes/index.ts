import { Hono } from "hono";
import { authGuard } from "@/middleware/auth.middleware";
import { ownerRoutes } from "./owner.routes";
import { sitterRoutes } from "./sitter.routes";

const apiRoutes = new Hono();

// Health check
apiRoutes.get("/health", (c) => c.json({ status: "ok" }));

// Owner routes
apiRoutes.use("/owners/*", authGuard);
apiRoutes.route("/owners", ownerRoutes);

// Sitter routes
apiRoutes.use("/sitters/*", authGuard);
apiRoutes.route("/sitters", sitterRoutes);

export { apiRoutes };
