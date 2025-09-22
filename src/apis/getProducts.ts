// src/hooks/useProducts.ts
import { useMemo } from "react";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import qs from "qs";
import { apiRequest } from "../ultis/api";
import axios from "axios";

export type ProductsParams = Partial<{
  categoryId: number[];                  // now arrays
  brandId: number[];
  make: string[];                        // VehicleMake slugs
  model: string[];                       // VehicleModel slugs
  minPrice: number;
  maxPrice: number;
  condition: Array<"NEW" | "USED" | "SCRAP">;
  sortBy: "newest" | "price_asc" | "price_desc" | "popular" | "rating";
  page: number;
  limit: number;
  search: string;
}>;


export type ProductDetail = {
  id: number;
  name_en: string; name_ar: string;
  description: string;
  price: number;
  priceAfterDiscount: number | null;
  discount: { percentage: number } | null;
  stock: number;
  sku: string;
  condition: "NEW" | "USED" | "SCRAP";
  freeDelivery: boolean;
  brand?: { id: number; name: string | null } | null;
  vendor: { id: number; businessName: string; isVerified: boolean };
  images: Array<{ id: number; url: string; alt?: string | null; position?: number }>;
  review?: { avg?: number | null };
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  category: any;
  count: any;
  attributes: any;
  oemNumber: any
};

function clean<T extends Record<string, any>>(obj: T): T {
  const out: any = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}

export function useGetProducts(params: ProductsParams = {}) {

  console.log(params)  

  const stableParams = useMemo(
    () =>
      clean({
        page: params.page ?? 1,
        limit: params.limit ?? 25,
        sortBy: params.sortBy ?? "newest",
        ...params,
      }),
    [params]
  );

  console.log('stable params', stableParams)

  return useQuery({
    queryKey: ["products", stableParams],
    queryFn: async () => {
      const { data } = await axios.get("/api/app-products", {
        params: stableParams,
        // send arrays as repeated keys: make=a&make=b
        paramsSerializer: (p) =>
          qs.stringify(p, { arrayFormat: "repeat", skipNulls: true }),
      });

      console.log(data)

      return data as {
        data: any[];
        pagination: { total: number; page: number; limit: number; totalPages: number };
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}

export function useProduct(id: any) {
  return useQuery<{ data: ProductDetail }>({
    queryKey: ['products', 'details', id],
    queryFn: async ({ signal }) => {
      const res = await apiRequest({
        method: 'post',
        path: '/api/app-products/single',
        body: { id },
        signal
      });

      return res
    },
    // Mobile-friendly freshness: refetch when screen mounts and on reconnect
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: false,
    retry: 1,
    // Optional: shape the data the component needs
  });
}

// Optional: prefetch before navigating (e.g., from a list)
export async function prefetchProduct(qc: ReturnType<typeof useQueryClient>, id: any) {
  await qc.prefetchQuery({
    queryKey: ['products', 'details', id],
    queryFn: async ({ signal }) => {
      const res = await apiRequest({
        method: 'post',
        path: '/api/app-products/single',
        body: { id },
        signal
      });
      return res
    },
    staleTime: 30_000,
  });
}
