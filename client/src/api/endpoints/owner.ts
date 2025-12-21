import { apiClient } from "@/api/client";

export const ownerApi = {
    createOwner: async (payload: any) => {
        const { data } = await apiClient.post('/owners/profile', payload);
        return data;
    },
    getOwner: async () => {
        try {
            const { data } = await apiClient.get('/owners/profile');
            return data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    },
};