import { Hono } from "hono";
import { authGuard } from "@/middleware/auth.middleware";
import { 
    submitReview, 
    getSitterReviews, 
    submitSitterReply 
} from "@/controllers/review.controller";

const reviewRoutes = new Hono();

// All review routes require authentication
reviewRoutes.use("*", authGuard);

// Owner routes
reviewRoutes.post("/", submitReview);

// Sitter routes
reviewRoutes.get("/sitter", getSitterReviews);
reviewRoutes.patch("/:id/reply", submitSitterReply);

export default reviewRoutes;
