import { apiClient } from "@/api/client";

export const uploadApi = {
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await apiClient.post<{ success: boolean; url: string }>('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },
};
