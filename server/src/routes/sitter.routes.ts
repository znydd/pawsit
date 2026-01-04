import { Hono } from "hono";
import {
    createSitterProfile,
    getSitterProfile,
    getSitterServices,
    updateSitterService,
    updateSitterAvailability,
    getSittersInRadius,
    getSittersByArea,
    patchSitterProfile
} from "@/controllers/sitter.controller";

const sitterRoutes = new Hono();

// GET
sitterRoutes.get("/profile", getSitterProfile);
sitterRoutes.get("/services", getSitterServices);
sitterRoutes.get("/search", getSittersInRadius);
sitterRoutes.get("/manual-search", getSittersByArea);
// POST
sitterRoutes.post("/profile", createSitterProfile);

// PATCH
sitterRoutes.patch("/services", updateSitterService);
sitterRoutes.patch("/availability", updateSitterAvailability);
sitterRoutes.patch("/profile", patchSitterProfile);


export { sitterRoutes };

