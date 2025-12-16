import { Hono } from "hono";
import {
    createSitterProfile,
    getSitterDashboard,
    getSitterBookings,
    getSitterServices,
    getSitterReviews,
    getSitterEarnings
} from "@/controllers/sitter.controller";

const sitterRoutes = new Hono();

// POST /api/sitters/become-sitter
sitterRoutes.post("/become-sitter", createSitterProfile);

// Dashboard endpoints
sitterRoutes.get("/dashboard", getSitterDashboard);
sitterRoutes.get("/dashboard/bookings", getSitterBookings);
sitterRoutes.get("/dashboard/services", getSitterServices);
sitterRoutes.get("/dashboard/reviews", getSitterReviews);
sitterRoutes.get("/dashboard/earnings", getSitterEarnings);

export { sitterRoutes };