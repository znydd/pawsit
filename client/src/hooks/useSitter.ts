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
export const useSearchSitters = (params: { lat: number; lng: number; radius: number } | null) => {
    return useQuery({
        queryKey: ['sitters', 'search', params],
        queryFn: () => sitterApi.searchSitters(params!),
        enabled: !!params,
    });
};
