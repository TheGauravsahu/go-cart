import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getProductByID, searchProduct } from "../api/product";
import type { Product } from "../types/product.types";
import { ApiResponse } from "@/types/apiRes.types";

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductByID(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery<ApiResponse<{ products: Product[] }>>({
    queryKey: ["search-products", query],
    queryFn: () => searchProduct(query),
    enabled: !!query,
  });
};
