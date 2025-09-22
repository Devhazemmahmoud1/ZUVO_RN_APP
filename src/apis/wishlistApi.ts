// src/apis/wishlist.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../ultis/axiosInstance";
import { useMemo } from "react";

export type WishlistItem = {
  id: number;
  productId: number;
  createdAt: string;
  product: { id: number; name_en: string; price: number; images: { url: string }[] };
};
export type WishlistResponse = { items: WishlistItem[]; count: number };

const WL_QK = ["wishlist"] as const;


export function useWishlist() {
  return useQuery({
    queryKey: WL_QK,
    queryFn: async () => (await axios.get<WishlistResponse>("/api/wishlist")).data,
    staleTime: 15_000,
  });
}

export function useWishlistIndex() {
  const { data, ...rest } = useWishlist();
  const index = useMemo(() => {
    const s = new Set<number>();
    (data?.items ?? []).forEach((i) => s.add(i.productId));
    return s; // fast membership check
  }, [data]);
  return { index, data, ...rest };
}

/** ADD */
export function useAddWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId }: { productId: number }) =>
      (await axios.post<WishlistResponse>("/api/wishlist", { productId })).data,
    // onMutate: async ({ productId }) => {
    //   await qc.cancelQueries({ queryKey: WL_QK });
    //   const prev = qc.getQueryData<WishlistResponse>(WL_QK);

    //   if (prev) {
    //     const exists = prev.items.some((i) => i.productId === productId);
    //     if (!exists) {
    //       const optimistic: WishlistResponse = {
    //         ...prev,
    //         items: [
    //           { id: -Date.now(), productId, createdAt: new Date().toISOString(), product: { id: productId, name_en: "", price: 0, images: [] } },
    //           ...prev.items,
    //         ],
    //         count: prev.count + 1,
    //       };
    //       qc.setQueryData(WL_QK, optimistic);
    //     }
    //   }
    //   return { prev };
    // },
    onError: (_e, _vars, ctx: any) => ctx?.prev && qc.setQueryData(WL_QK, ctx.prev),
    onSuccess: (fresh) => qc.setQueryData(WL_QK, fresh),
    onSettled: () => qc.invalidateQueries({ queryKey: WL_QK, exact: true }),
  });
}

/** REMOVE */
export function useRemoveWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId }: { productId: number }) =>
      (await axios.delete<WishlistResponse>(`/api/wishlist/${productId}`)).data,
    onMutate: async ({ productId }) => {
      await qc.cancelQueries({ queryKey: WL_QK });
      const prev = qc.getQueryData<WishlistResponse>(WL_QK);

      if (prev) {
        const optimistic: WishlistResponse = {
          ...prev,
          items: prev.items.filter((i) => i.productId !== productId),
          count: Math.max(0, prev.count - 1),
        };
        qc.setQueryData(WL_QK, optimistic);
      }
      return { prev };
    },
    onError: (_e, _vars, ctx) => ctx?.prev && qc.setQueryData(WL_QK, ctx.prev),
    onSuccess: (fresh) => qc.setQueryData(WL_QK, fresh),
    onSettled: () => qc.invalidateQueries({ queryKey: WL_QK, exact: true }),
  });
}

/** Optional: single toggle hook (if you use /toggle) */
export function useToggleWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId }: { productId: number }) =>
      (await axios.post<WishlistResponse>("/api/wishlist/toggle", { productId })).data,
    onMutate: async ({ productId }) => {
      await qc.cancelQueries({ queryKey: WL_QK });
      const prev = qc.getQueryData<WishlistResponse>(WL_QK);
      if (prev) {
        const has = prev.items.some((i) => i.productId === productId);
        const optimistic: WishlistResponse = {
          ...prev,
          items: has
            ? prev.items.filter((i) => i.productId !== productId)
            : [{ id: -Date.now(), productId, createdAt: new Date().toISOString(), product: { id: productId, name_en: "", price: 0, images: [] } }, ...prev.items],
          count: has ? Math.max(0, prev.count - 1) : prev.count + 1,
        };
        qc.setQueryData(WL_QK, optimistic);
      }
      return { prev };
    },
    onError: (_e, _vars, ctx) => ctx?.prev && qc.setQueryData(WL_QK, ctx.prev),
    onSuccess: (fresh) => qc.setQueryData(WL_QK, fresh),
    onSettled: () => qc.invalidateQueries({ queryKey: WL_QK, exact: true }),
  });
}
