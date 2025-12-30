import { apiClient } from "@/api/client";

export interface CreateBookingPayload {
    sitterId: number;
    serviceId: number;
    totalPrice: number;
    specialRequest?: string;
}

export interface Booking {
    id: number;
    sitterId: number;
    ownerId: number;
    serviceId: number;
    isAccepted: boolean;
    totalPrice: number;
    specialRequest: string | null;
    bookingCode: string;
    createdAt: string;
    updatedAt: string;
    // Sitter details (populated by JOIN)
    sitterName?: string;
    sitterImage?: string;
    sitterHeadline?: string;
    sitterCity?: string;
    sitterAddress?: string;
    sitterRating?: number;
    // Owner details (populated by JOIN)
    ownerName?: string;
    ownerImage?: string;
    ownerCity?: string;
    ownerAddress?: string;
    // Service details (populated by JOIN)
    serviceType?: string;
    pricePerDay?: number;
}

export const bookingApi = {
    // Owner: Create booking request
    createBooking: async (payload: CreateBookingPayload) => {
        const { data } = await apiClient.post('/bookings', payload);
        return data.booking;
    },

    // Owner: Get all bookings (with optional status filter)
    getOwnerBookings: async (status?: 'pending' | 'accepted') => {
        const params = status ? { status } : {};
        const { data } = await apiClient.get('/bookings/owner', { params });
        return data.bookings as Booking[];
    },

    // Sitter: Get all bookings (with optional status filter)
    getSitterBookings: async (status?: 'pending' | 'accepted') => {
        const params = status ? { status } : {};
        const { data } = await apiClient.get('/bookings/sitter', { params });
        return data.bookings as Booking[];
    },

    // Sitter: Accept booking
    acceptBooking: async (bookingId: number) => {
        const { data } = await apiClient.patch(`/bookings/${bookingId}/accept`);
        return data.booking;
    },

    // Owner: Delete pending booking
    deleteBooking: async (bookingId: number) => {
        const { data } = await apiClient.delete(`/bookings/${bookingId}`);
        return data;
    },
};
