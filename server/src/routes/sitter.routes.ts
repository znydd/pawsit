import { Hono } from "hono";
import { createSitterProfile, getSitterProfile } from "@/controllers/sitter.controller";

const sitterRoutes = new Hono();

// POST /api/sitters/become-sitter
sitterRoutes.post("/become-sitter", createSitterProfile);

// GET /api/sitters/sitterprofile - View own sitter profile
sitterRoutes.get("/sitterprofile", getSitterProfile);

export { sitterRoutes };
