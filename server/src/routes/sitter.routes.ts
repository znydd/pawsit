import { Hono } from "hono";
import { createSitterProfile,
    getSitterProfile,
    getSitterServices,
    updateSitterService,
    updateSitterAvailability,
    getSittersInRadius
} from "@/controllers/sitter.controller";

const sitterRoutes = new Hono();

// GET
sitterRoutes.get("/profile", getSitterProfile);
sitterRoutes.get("/services", getSitterServices);
sitterRoutes.get("/search", getSittersInRadius);

// POST
sitterRoutes.post("/profile", createSitterProfile);

// PATCH
sitterRoutes.patch("/services", updateSitterService);
sitterRoutes.patch("/availability", updateSitterAvailability);


export { sitterRoutes };
