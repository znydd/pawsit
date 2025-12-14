import { Hono } from "hono";
import { getOwnerProfile } from "@/controllers/owner.controller";

const ownerRoutes = new Hono();

ownerRoutes.get("/profile", getOwnerProfile);



export { ownerRoutes };