import { ApiResponse } from "@/types/apiRes.types";
import type { Product } from "../types/product.types";
import { api } from "../utils/axios";

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products/");
  return res.data.data;
};

export const getProductByID = async (id: string): Promise<Product> => {
  const res = await api.get("/products/" + id);
  return res.data;
};

export const searchProduct = async (
  query: string
): Promise<ApiResponse<{ products: Product[] }>> => {
  const res = await api.get(`/products/search?q=${query}`);
  return res.data;
};
