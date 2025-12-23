import { Hono } from "hono";
import { createSitterProfile, getSitterProfile, updateSitterAvailability, getSitterAvailability } from "@/controllers/sitter.controller";

const sitterRoutes = new Hono();

// GET
sitterRoutes.get("/profile", getSitterProfile);

// POST
sitterRoutes.post("/profile", createSitterProfile);

// Availability
sitterRoutes.get("/availability", getSitterAvailability);
sitterRoutes.post("/availability", updateSitterAvailability);


export { sitterRoutes };
