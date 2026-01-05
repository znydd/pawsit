import { apiClient } from "@/api/client";

export const ownerApi = {
    createOwner: async (payload: any) => {
        const { data } = await apiClient.post('/owners/profile', payload);
        return data.owner;
    },
    getOwner: async () => {
        try {
            const { data } = await apiClient.get('/owners/profile');
            return data.owner;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    },
    patchOwner: async (payload: {
        displayName?: string;
        displayImage?: string;
        phoneNumber?: string;
        bio?: string;
        address?: string;
        area?: string;
    }) => {
        const { data } = await apiClient.patch('/owners/profile', payload);
        return data.owner;
    },
    deleteAccount: async () => {
        const { data } = await apiClient.delete('/users/delete-account');
        return data;
    },
};