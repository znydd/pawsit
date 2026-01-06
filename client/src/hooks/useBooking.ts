import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingApi, type CreateBookingPayload } from "@/api/endpoints/booking";
import { toast } from "sonner";

// Owner: Get bookings
export const useOwnerBookings = (status?: 'pending' | 'accepted') => {
    return useQuery({
        queryKey: ['bookings', 'owner', status],
        queryFn: () => bookingApi.getOwnerBookings(status),
    });
};

// Sitter: Get bookings
export const useSitterBookings = (status?: 'pending' | 'accepted') => {
    return useQuery({
        queryKey: ['bookings', 'sitter', status],
        queryFn: () => bookingApi.getSitterBookings(status),
    });
};

// Owner: Create booking
export const useCreateBooking = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateBookingPayload) => bookingApi.createBooking(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['bookings', 'owner'] });
            qc.invalidateQueries({ queryKey: ['sitters', 'search'] });
            toast.success("Booking request sent successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to send booking request");
        }
    });
};

// Sitter: Accept booking
export const useAcceptBooking = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: bookingApi.acceptBooking,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['bookings', 'sitter'] });
            toast.success("Booking accepted! Sitting confirmed.");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to accept booking");
        }
    });
};

// Owner: Delete booking
export const useDeleteBooking = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: bookingApi.deleteBooking,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['bookings', 'owner'] });
            qc.invalidateQueries({ queryKey: ['sitters', 'search'] });
            toast.success("Booking removed.");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to remove booking");
        }
    });
};

// Sitter: Decline booking
export const useDeclineBooking = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: bookingApi.deleteBooking,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['bookings', 'sitter', 'pending'] });
            toast.success("Booking declined.");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to decline booking");
        }
    });
};
