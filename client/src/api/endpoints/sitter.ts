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
    searchSitters: async (params: { lat: number; lng: number; radius: number }) => {
        console.log(params);
        const { data } = await apiClient.get('/sitters/search', { params });
        return data.sitters;
    },
};