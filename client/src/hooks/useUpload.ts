import { useMutation } from "@tanstack/react-query";
import { uploadApi } from "@/api/endpoints/upload";

export const useUpload = () => {
    const mutation = useMutation({
        mutationFn: uploadApi.uploadImage,
    });
    return mutation;
};
