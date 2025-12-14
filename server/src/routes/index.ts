import { Hono } from "hono";
import { authGuard } from "@/middleware/auth.middleware";
import { ownerRoutes } from "./owner.routes";


const apiRoutes = new Hono();

// Health check
apiRoutes.get("/health", (c) => c.json({ status: "ok" }));

apiRoutes.use("/owners/*", authGuard);
apiRoutes.route("/owners", ownerRoutes);



export { apiRoutes };
