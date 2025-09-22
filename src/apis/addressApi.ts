import { apiRequest } from '../ultis/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const ADDRESS_QK = ['addresses'];

export const useAddresses = () => {
  return useQuery({
    queryKey: ADDRESS_QK,
    queryFn: async () => {
      const { data } = await apiRequest({
        path: '/api/customer-account/addresses',
        method: 'get',
      });

      return data;
    },
    staleTime: 60_000, // optional: 1 min fresh
    retry: 1, // optional
  });
};

export const useConfirmDefaultAddress = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ defaultAddress } : {defaultAddress : any}) => {
            const data = await apiRequest({
                path: '/api/customer-account/addresses-confirm',
                method: 'post',
                body: {
                    defaultAddress: defaultAddress
                }
            })

            return data
        },
        onError: (_err, _vars, ctx: any) => {
            if (ctx?.prev) qc.setQueryData(ADDRESS_QK, ctx.prev); // rollback
        },
        onSuccess: freshCart => {
            // replace optimistic data with the **fresh** cart returned by backend
            qc.setQueryData(ADDRESS_QK, freshCart);
            qc.invalidateQueries({ queryKey: ADDRESS_QK, refetchType: 'active' });
        },
        onSettled: () => {
            // ensure we’re fully in sync (covers any edge cases)
            qc.invalidateQueries({ queryKey: ADDRESS_QK, exact: true });
        },
    })
}

export const useDeleteAddress = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ id } : {id : any}) => {
            const data = await apiRequest({
                path: '/api/customer-account/addresses-delete',
                method: 'delete',
                body: {
                    id
                }
            })

            return data
        },
        onError: (_err, _vars, ctx: any) => {
            if (ctx?.prev) qc.setQueryData(ADDRESS_QK, ctx.prev); // rollback
        },
        onSuccess: freshData => {
            // replace optimistic data with the **fresh** cart returned by backend
            qc.setQueryData(ADDRESS_QK, freshData);
            qc.invalidateQueries({ queryKey: ADDRESS_QK, refetchType: 'active' });
        },
        onSettled: () => {
            // ensure we’re fully in sync (covers any edge cases)
            qc.invalidateQueries({ queryKey: ADDRESS_QK, exact: true });
        },
    })
}

export const useAddAddress = () => {
    const qc = useQueryClient();
    console.log('came here ')
    return useMutation({
        mutationFn: async ({ firstName, lastName, mobileNumber, additionalAddress, address, location } : any) => {

            const { data }  = await apiRequest({
                path: '/api/customer-account/add-address',
                method: 'post',
                body: {
                    firstName: firstName || undefined,
                    lastName: lastName || undefined,
                    phone: mobileNumber || undefined,
                    additionalAddress: additionalAddress || undefined,
                    address: address || undefined,
                    location: location|| undefined,
                }
            })

            return data
        },
        onError: (_err, _vars, ctx: any) => {
            if (ctx?.prev) qc.setQueryData(ADDRESS_QK, ctx.prev); // rollback
        },
        onSuccess: freshData => {
            // replace optimistic data with the **fresh** cart returned by backend
            qc.setQueryData(ADDRESS_QK, freshData);
            qc.invalidateQueries({ queryKey: ADDRESS_QK, refetchType: 'active' });
        },
        onSettled: () => {
            // ensure we’re fully in sync (covers any edge cases)
            qc.invalidateQueries({ queryKey: ADDRESS_QK, exact: true });
        },
    })
}


export const useEditAddress = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id,firstName, lastName, mobileNumber, additionalAddress, address, location } : any) => {

            const { data }  = await apiRequest({
                path: '/api/customer-account/addresses-edit',
                method: 'post',
                body: {
                    id: id,
                    firstName: firstName || undefined,
                    lastName: lastName || undefined,
                    phone: mobileNumber || undefined,
                    additionalAddress: additionalAddress || undefined,
                    address: address || undefined,
                    location: location|| undefined,
                }
            })

            return data
        },
        onError: (_err, _vars, ctx: any) => {
            if (ctx?.prev) qc.setQueryData(ADDRESS_QK, ctx.prev); // rollback
        },
        onSuccess: freshData => {
            // replace optimistic data with the **fresh** cart returned by backend
            qc.setQueryData(ADDRESS_QK, freshData);
            qc.invalidateQueries({ queryKey: ADDRESS_QK, refetchType: 'active' });
        },
        onSettled: () => {
            // ensure we’re fully in sync (covers any edge cases)
            qc.invalidateQueries({ queryKey: ADDRESS_QK, exact: true });
        },
    })
}