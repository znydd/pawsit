import { apiClient } from "@/api/client";

export const chatApi = {
    getToken: async () => {
        const { data } = await apiClient.get('/chat/token');
        return data.token;
    },
};
