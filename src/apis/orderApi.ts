import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../ultis/api';

const ORDER_QK = ['orders'] as const;

export const useOrders = () => {
  return useQuery({
    queryKey: ORDER_QK,
    queryFn: async () => {
      const data = await apiRequest({
        path: '/api/checkout/my-orders',
        method: 'get',
      });
      return data;
    },
    staleTime: 15_000,
  });
};

export const useMakeOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      deliveryAddress,
      leaveAtDoor,
      deliveryDay,
      receiver,
      paymentMethod
    }: {
      deliveryAddress: any;
      leaveAtDoor?: any;
      deliveryDay: any;
      receiver: any;
      paymentMethod: any
    }) =>
      await apiRequest({
        method: 'post',
        path: '/api/checkout',
        body: {
            deliveryAddress,
            leaveAtDoor,
            deliveryDay,
            receiver,
            paymentMethod
        },
      }),
    onError: (_err, _vars, ctx: any) => {
      if (ctx?.prev) qc.setQueryData(ORDER_QK, ctx.prev);
    },
    onSuccess: freshCart => {
      // replace optimistic data with the **fresh** cart returned by backend
      // qc.setQueryData(ORDER_QK, freshCart);
      qc.invalidateQueries({ queryKey: ORDER_QK, refetchType: 'active' });
      qc.invalidateQueries({ queryKey: ['cart'], exact: true });
    },
    onSettled: () => {
      // ensure we’re fully in sync (covers any edge cases)
      qc.invalidateQueries({ queryKey: ORDER_QK, exact: true });
      qc.invalidateQueries({ queryKey: ['cart'], exact: true });
    },
  });
};
