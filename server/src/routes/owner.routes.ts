import { Hono } from "hono";
import { getOwnerProfile, createOwnerProfile, patchOwnerProfile } from "@/controllers/owner.controller";

const ownerRoutes = new Hono();

// GET
ownerRoutes.get("/profile", getOwnerProfile);

// POST
ownerRoutes.post("/profile", createOwnerProfile);

// PATCH
ownerRoutes.patch("/profile", patchOwnerProfile);

export { ownerRoutes };