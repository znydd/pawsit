import { Hono } from "hono";
import { getOwnerProfile, createOwnerProfile } from "@/controllers/owner.controller";

const ownerRoutes = new Hono();

// GET
ownerRoutes.get("/profile", getOwnerProfile);

// POST
ownerRoutes.post("/profile", createOwnerProfile);


export { ownerRoutes };