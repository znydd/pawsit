import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi, type SubmitReviewPayload, type SubmitReplyPayload } from "@/api/endpoints/review";
import { toast } from "sonner";

// Sitter: Get reviews
export const useSitterReviews = () => {
    return useQuery({
        queryKey: ['reviews', 'sitter'],
        queryFn: () => reviewApi.getSitterReviews(),
    });
};

// Owner: Submit review
export const useSubmitReview = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: SubmitReviewPayload) => reviewApi.submitReview(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['bookings', 'owner'] });
            qc.invalidateQueries({ queryKey: ['reviews', 'sitter'] });
            qc.invalidateQueries({ queryKey: ['sitters', 'search'] });
            toast.success("Review submitted! Booking completed.");
        },

        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to submit review");
        }
    });
};

// Sitter: Submit reply
export const useSubmitReply = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: SubmitReplyPayload) => reviewApi.submitReply(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['reviews', 'sitter'] });
            toast.success("Reply submitted!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to submit reply");
        }
    });
};
