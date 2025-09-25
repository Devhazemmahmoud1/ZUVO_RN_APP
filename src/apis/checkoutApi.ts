import axiosInstance from '../ultis/axiosInstance';
import { apiRequest } from '../ultis/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const CHECKOUT_RECEIVER_QR = ['checkout_receiver'];

export const useGetReceivers = () => {
  return useQuery({
    queryKey: CHECKOUT_RECEIVER_QR,
    queryFn: async () => {
      const data  = await apiRequest({
        path: '/api/checkout/get-receivers',
        method: 'get',
      });

      console.log('data from the backend', data)

      return data;
    },
    staleTime: 60_000, // optional: 1 min fresh
    retry: 1, // optional
  });
};


export function useAddReceiver() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: async ({
        name,
        phone,
      }: {
        name: string;
        phone: string;
      }) =>
        (await axiosInstance.post('/api/checkout/add-receiver', { name, phone })).data, // returns full, fresh cart
      onError: (_err, _vars, ctx: any) => {
        if (ctx?.prev) qc.setQueryData(CHECKOUT_RECEIVER_QR, ctx.prev); // rollback
      },
      onSuccess: freshCart => {
        // replace optimistic data with the **fresh** cart returned by backend
        qc.setQueryData(CHECKOUT_RECEIVER_QR, freshCart);
        qc.invalidateQueries({ queryKey: CHECKOUT_RECEIVER_QR, refetchType: 'active' });
      },
      onSettled: () => {
        // ensure we’re fully in sync (covers any edge cases)
        qc.invalidateQueries({ queryKey: CHECKOUT_RECEIVER_QR, exact: true });
      },
    });
  }