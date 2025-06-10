import { AddReviewFormValues } from "@/pages/ProductDetails/Reviews";
import { ApiResponse } from "@/types/apiRes.types";
import { Review } from "@/types/review.types";
import { api } from "@/utils/axios";

export const getAllReviews = async (
  productId: string
): Promise<ApiResponse<{ reviews: Review[] }>> => {
  const res = await api.get("/products/" + productId + "/reviews/");
  return res.data;
};

export const addReview = async (
  productId: string,
  data: AddReviewFormValues
): Promise<ApiResponse<string>> => {
  const res = await api.post("/products/" + productId + "/reviews/", data);
  return res.data;
};

export const deleteReview = async (
  productId: string,
  reviewId: string
): Promise<ApiResponse<string>> => {
  const res = await api.delete(
    "/products/" + productId + "/reviews/" + reviewId
  );
  return res.data;
};

export const updateReview = async (
  productId: string,
  reviewId: string,
  data: AddReviewFormValues
): Promise<ApiResponse<string>> => {
  const res = await api.put(
    "/products/" + productId + "/reviews/" + reviewId,
    data
  );
  return res.data;
};
