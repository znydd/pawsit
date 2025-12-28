import { Hono } from "hono";
import { createSitterProfile, getSitterProfile, getSitterServices, createSitterService } from "@/controllers/sitter.controller";

const sitterRoutes = new Hono();

// GET
sitterRoutes.get("/profile", getSitterProfile);

// POST
sitterRoutes.post("/profile", createSitterProfile);

//GET
sitterRoutes.get("/services", getSitterServices);

//POST
sitterRoutes.post("/services", createSitterService);


export { sitterRoutes };
