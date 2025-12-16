import { apiClient } from "@/api/client";

export const ownerApi = {
    createOwner: async (payload: any) => {
        const { data } = await apiClient.post('/owners', payload);
        return data;
    },
    getOwner: async () => {
        const { data } = await apiClient.get('/owners');
        return data;
    },
};