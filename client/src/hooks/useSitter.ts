import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sitterApi } from "@/api/endpoints/sitter";

export const useSitter = () => {
    const query = useQuery({
        queryKey: ['sitter'],
        queryFn: sitterApi.getSitter,
    });
    return query;
};

export const useCreateSitter = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: sitterApi.createSitter,
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ['sitter'],
            });
            qc.invalidateQueries({
                queryKey: ['owner'],
            });
        },
    });
    return mutation;
};
export const useSearchSitters = (params: { lat?: number; lng?: number; radius?: number; area?: string } | null) => {
    return useQuery({
        queryKey: ['sitters', 'search', params],
        queryFn: () => sitterApi.searchSitters(params!),
        enabled: !!params && (!!params.area || (!!params.lat && !!params.lng)),
    });
};

export const useSitterPhotos = () => {
    return useQuery({
        queryKey: ['sitter-photos'],
        queryFn: sitterApi.getPhotos,
    });
};

export const useUploadSitterPhoto = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: sitterApi.savePhoto,
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ['sitter-photos'],
            });
        },
    });
};

export const useUpdateSitter = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: sitterApi.patchSitter,
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ['sitter'],
            });
        },
    });
};

export const useSitterServices = () => {
    return useQuery({
        queryKey: ['sitter-services'],
        queryFn: sitterApi.getServices,
    });
};

export const useUpdateService = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: sitterApi.updateService,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['sitter-services'] });
        },
    });
};

export const useUpdateAvailability = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: sitterApi.updateAvailability,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['sitter'] });
        },
    });
};
