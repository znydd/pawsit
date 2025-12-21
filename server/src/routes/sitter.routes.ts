import { Hono } from "hono";
import { createSitterProfile, getSitterProfile } from "@/controllers/sitter.controller";

const sitterRoutes = new Hono();

// GET
sitterRoutes.get("/profile", getSitterProfile);

// POST
sitterRoutes.post("/profile", createSitterProfile);


export { sitterRoutes };
