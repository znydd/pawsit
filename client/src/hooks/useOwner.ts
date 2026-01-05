import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerApi } from "@/api/endpoints/owner";


export const useOwner = () => {
    const query = useQuery({
        queryKey: ['owner'],
        queryFn: ownerApi.getOwner,
        retry: false,
    });
    return query;
};

export const useCreateOwner = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: ownerApi.createOwner,
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ['owner'],
            });
        },
    });
    return mutation;
};

export const useUpdateOwner = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ownerApi.patchOwner,
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ['owner'],
            });
        },
    });
};

export const useDeleteAccount = () => {
    return useMutation({
        mutationFn: ownerApi.deleteAccount,
    });
};
