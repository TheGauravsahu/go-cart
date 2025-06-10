import {
  addReview,
  deleteReview,
  getAllReviews,
  updateReview,
} from "@/api/review";
import { AddReviewFormValues } from "@/pages/ProductDetails/Reviews";
import { useAuthStore } from "@/store/authStore";
import { ApiResponse, ErrorResponse } from "@/types/apiRes.types";
import { Review } from "@/types/review.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useReviews = (productId: string) => {
  return useQuery<ApiResponse<{ reviews: Review[] }>>({
    queryKey: ["products", productId, "reviews"],
    queryFn: () => getAllReviews(productId),
    refetchOnWindowFocus: false,
  });
};

export const useAddReview = (productId: string) => {
  const { user } = useAuthStore();
  const queryKey = ["products", productId, "reviews"];
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddReviewFormValues) => addReview(productId, data),
    onMutate: async (newReview) => {
      await queryClient.cancelQueries({
        queryKey: queryKey,
      });

      const prevData =
        queryClient.getQueryData<ApiResponse<{ reviews: Review[] }>>(queryKey);

      queryClient.setQueryData(
        queryKey,
        (old: ApiResponse<{ reviews: Review[] }> | undefined) => ({
          ...old,
          data: {
            ...old?.data,
            reviews: [
              {
                id: Date.now(),
                user_id: user?.id,
                product_id: Number(productId),
                rating: newReview.rating,
                comment: newReview.comment,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              ...(old?.data?.reviews || []),
            ],
          },
        })
      );
      return { prevData };
    },

    onError: (err, _, context) => {
      queryClient.setQueryData(queryKey, context?.prevData);
      console.log(err);
      toast.error("Failed to add review. Try again.");
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      toast.success(data.message || "Review added successfully.");
    },
  });
};

export const useDeleteReview = (productId: string, reviewId: string) => {
  const queryKey = ["products", productId, "reviews"];
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteReview(productId, reviewId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      toast.success(data.message || "Review deleted successfully.");
    },

    onError: (error: { response: { data: ErrorResponse } }) => {
      const errorMessage =
        error.response?.data?.error || "Failed to delete review.";
      toast.error(errorMessage);
    },
  });
};

export const useEditReview = (productId: string, reviewId: string) => {
  const queryKey = ["products", productId, "reviews"];
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddReviewFormValues) =>
      updateReview(productId, reviewId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      toast.success(data.message || "Review updated successfully.");
    },
    onError: (error: { response: { data: ErrorResponse } }) => {
      const errorMessage =
        error.response?.data?.error || "Failed to edit review.";
      toast.error(errorMessage);
    },
  });
};
