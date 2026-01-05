import { apiClient } from "@/api/client";

export const sitterApi = {
    createSitter: async (payload: any) => {
        const { data } = await apiClient.post('/sitters/profile', payload);
        return data.sitter;
    },
    getSitter: async () => {
        try {
            const { data } = await apiClient.get('/sitters/profile');
            return data.sitter;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    },
    searchSitters: async (params: { lat?: number; lng?: number; radius?: number; area?: string }) => {
        const endpoint = params.area ? '/sitters/manual-search' : '/sitters/search';
        const { data } = await apiClient.get(endpoint, { params });
        return data.sitters;
    },
    getPhotos: async () => {
        const { data } = await apiClient.get('/sitters/photos');
        return data.photos;
    },
    savePhoto: async (payload: { imageUrl: string; photoType: string; caption?: string }) => {
        const { data } = await apiClient.post('/sitters/photos', payload);
        return data.photo;
    },
    patchSitter: async (payload: {
        displayName?: string;
        displayImage?: string;
        phoneNumber?: string;
        headline?: string;
        bio?: string;
        area?: string;
        experienceYears?: number;
        acceptsLargeDogs?: boolean;
        acceptsSmallDogs?: boolean;
        acceptsCats?: boolean;
        acceptsFish?: boolean;
        acceptsBirds?: boolean;
        acceptsOtherPets?: boolean;
    }) => {
        const { data } = await apiClient.patch('/sitters/profile', payload);
        return data.sitter;
    },
    getServices: async () => {
        const { data } = await apiClient.get('/sitters/services');
        return data.services;
    },
    updateService: async (payload: { pricePerDay?: number; serviceType?: string; isActive?: boolean }) => {
        const { data } = await apiClient.patch('/sitters/services', payload);
        return data.service;
    },
    updateAvailability: async (payload: { isAvailable: boolean }) => {
        const { data } = await apiClient.patch('/sitters/availability', payload);
        return data.availability;
    },
};