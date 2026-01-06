import { Hono } from "hono";
import {
    createSitterProfile,
    getSitterProfile,
    getSitterServices,
    updateSitterService,
    updateSitterAvailability,
    getSittersInRadius,
    getSittersByArea,
    patchSitterProfile,
    getSitterPhotos,
    uploadSitterPhoto,
    getPublicSitterPhotos
} from "@/controllers/sitter.controller";

const sitterRoutes = new Hono();

// GET
sitterRoutes.get("/profile", getSitterProfile);
sitterRoutes.get("/services", getSitterServices);
sitterRoutes.get("/search", getSittersInRadius);
sitterRoutes.get("/manual-search", getSittersByArea);
sitterRoutes.get("/photos", getSitterPhotos);
sitterRoutes.get("/photos/:sitterId", getPublicSitterPhotos);
// POST
sitterRoutes.post("/profile", createSitterProfile);
sitterRoutes.post("/photos", uploadSitterPhoto);

// PATCH
sitterRoutes.patch("/services", updateSitterService);
sitterRoutes.patch("/availability", updateSitterAvailability);
sitterRoutes.patch("/profile", patchSitterProfile);


export { sitterRoutes };

