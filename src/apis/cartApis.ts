// src/apis/useCart.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../ultis/axiosInstance';
import { useMemo } from 'react';
import { apiRequest } from '../ultis/api';
// import {
//   apiGetCart,
//   apiEnsureCart,
//   apiAddItem,
//   apiSetItemQty,
//   apiRemoveItem,
//   apiClearCart,
//   apiApplyCoupon,
//   apiMergeGuest,
//   CartResponse,
// } from "./cartApi";

export type CartStatus = 'ACTIVE' | 'ORDERED' | 'ABANDONED';

export type CartLine = {
  id: number;
  productId: number;
  name: string;
  sku: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  image?: string | null;
  stock: number;
  freeDelivery: boolean;
  discountPct: number;
};

export type CartResponse = {
  id: number;
  status: CartStatus;
  coupon: { id: number; code: string } | null;
  items: CartLine[];
  totals: {
    subtotal: number;
    couponDiscount: number;
    total: number;
  };
};

// Optional toast helper (safe if Toast isn't installed)
// function notify(msg: string) {
//   // @ts-ignore
//   const Toast = global?.Toast || (require("react-native-toast-message").default as any);
//   if (Toast?.show) {
//     Toast.show({ type: "success", text1: msg });
//   } else {
//     console.log("[Toast]", msg);
//   }
// }

const CART_QK = ['cart'] as const;

// Read cart (creates it on demand server-side anyway)
export function useCart() {
  return useQuery({
    queryKey: CART_QK,
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/cart');
      return data;
    },
    staleTime: 15_000,
  });
}

export function useCartIndex() {
  const { data, ...rest } = useCart();
  const index = useMemo(() => {
    const m: Record<number, { qty: number; lineId: number }> = {};
    (data?.items ?? []).forEach(
      i => (m[i.productId] = { qty: i.qty, lineId: i.id }),
    );
    return m;
  }, [data]);
  return { index, data, ...rest };
}

// Ensure a cart exists (usually not needed because GET /cart already creates it in your service)
// export function useEnsureCart() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: apiEnsureCart,
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: CART_QK });
//       notify("Cart is ready");
//     },
//   });
// }

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      qty = 1,
    }: {
      productId: number;
      qty?: number;
    }) =>
      (await axiosInstance.post('/api/cart/items', { productId, qty })).data, // returns full, fresh cart
    onError: (_err, _vars, ctx: any) => {
      if (ctx?.prev) qc.setQueryData(CART_QK, ctx.prev); // rollback
    },
    onSuccess: freshCart => {
      // replace optimistic data with the **fresh** cart returned by backend
      qc.setQueryData(CART_QK, freshCart);
      qc.invalidateQueries({ queryKey: CART_QK, refetchType: 'active' });
    },
    onSettled: () => {
      // ensure we’re fully in sync (covers any edge cases)
      qc.invalidateQueries({ queryKey: CART_QK, exact: true });
    },
  });
}

export function useSetCartItemQty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, qty }: { itemId: number; qty: number }) => {
      const data = await apiRequest({
        method: 'patch',
        path: `/api/cart/items/${itemId}`,
        body: {
          qty: qty,
        },
      });

      return data;
    },
    onSuccess: (data: CartResponse) => {
      qc.setQueryData(CART_QK, data);
    },
    onSettled: () => {
      // ensure we’re fully in sync (covers any edge cases)
      qc.invalidateQueries({ queryKey: CART_QK, exact: true });
    },
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({itemId } : {itemId: number} ) => {
      const data = await apiRequest({
        path: `/api/cart/items/${itemId}`,
        method: 'delete',
      });

      return data;
    },
    onSuccess: (data: CartResponse) => {
      qc.setQueryData(CART_QK, data);
    },
    onSettled: () => {
      // ensure we’re fully in sync (covers any edge cases)
      qc.invalidateQueries({ queryKey: CART_QK, exact: true });
    },
  });
}

// export function useClearCart() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: apiClearCart,
//     onSuccess: (data: CartResponse) => {
//       qc.setQueryData(CART_QK, data);
//       notify("Cart cleared");
//     },
//   });
// }

// export function useApplyCoupon() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (code: string) => apiApplyCoupon(code),
//     onSuccess: (data: CartResponse) => {
//       qc.setQueryData(CART_QK, data);
//       notify("Coupon applied");
//     },
//   });
// }

// export function useMergeGuestCart() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ sessionId, userId }: { sessionId: string; userId: number }) =>
//       apiMergeGuest(sessionId, userId),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: CART_QK });
//       notify("Cart merged");
//     },
//   });
// }
