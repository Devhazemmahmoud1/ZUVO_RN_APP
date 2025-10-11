// src/apis/useProductsInfinite.ts
import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../ultis/axiosInstance";
import qs from "qs";

export type ProductsParams = Partial<{
  categoryId: number[];
  brandId: number[];
  make: string[];
  model: string[];
  condition: ("NEW" | "USED" | "SCRAP")[];
  minPrice: number;
  maxPrice: number;
  sortBy: "newest" | "price_asc" | "price_desc" | "popular" | "rating";
  limit: number;
  search: string;
}>;

type ApiResponse = {
  data: any[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
};

function clean(obj: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      if (v.length) out[k] = v;
    } else if (v !== undefined && v !== null && v !== "") {
      out[k] = v;
    }
  }
  return out;
}

export function useProductsInfinite(params: ProductsParams = {}) {

  console.log('this is the params'  , params)
  console.log('came here')

  const stable = useMemo(
    () =>
      clean({
        limit: params.limit ?? 5,
        sortBy: params.sortBy ?? "newest",
        ...params,
      }),
    [params]
  );

  console.log('came here too')  
  console.log(stable, 'before')

  return useInfiniteQuery<ApiResponse>({
    queryKey: ["products", stable],
    initialPageParam: 1,
    refetchOnWindowFocus: 'always',
    refetchOnMount: 'always',       // ⬅️ force a refetch when screen mounts
    refetchOnReconnect: 'always',
    // ⬇️ Add robust debug + cancel-awareness
    queryFn: async ({ pageParam, signal }) => {
      try {
        console.log("[products] params:", stable, "page:", pageParam);
        const res = await axiosInstance.get("/api/app-products", {
          params: { ...stable, page: pageParam },
          paramsSerializer: () => qs.stringify({ ...stable, page: pageParam }, { arrayFormat: "repeat" }),
          signal, // keep this if your axios supports AbortController (v0.27+)
        });
        console.log("[products] response:", res.data);

        return res.data as ApiResponse;
      } catch (err: any) {
        // If axios respects AbortController, cancelled requests end up here
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
          console.warn("[products] request cancelled");
        } else {
          console.error("[products] request failed:", err);
        }
        throw err; // Let React Query handle error state
      }
    },
  
    getNextPageParam: (last) => {
      const { page, totalPages } = last.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  
    // Keep previous pages visible when fetching next
    // placeholderData: (prev) => prev,

    // sensible timings (ms)
    staleTime: 0,        // 30s fresh
    gcTime: 5 * 60 * 1000,
    retry: 2,                 // disable while debugging
  });
}
