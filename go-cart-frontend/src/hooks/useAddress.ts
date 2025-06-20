import { addAddress, deleteAddress, listAddresses } from "@/api/address";
import { AddAddressValues } from "@/pages/Profile/Addresses/AddAddress";
import { Address } from "@/types/address.types";
import { ApiResponse, ErrorResponse } from "@/types/apiRes.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddresses = () => {
  return useQuery<ApiResponse<{ addresses: Address[] }>>({
    queryKey: ["addresses"],
    queryFn: listAddresses,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addrData: AddAddressValues) => addAddress(addrData),
    onSuccess: (data) => {
      const successMsg = data.message || "Address added successfully.";
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success(successMsg);
    },
    onError: (error: { response: { data: ErrorResponse } }) => {
      const errorMessage =
        error.response?.data?.error || "Failed to add address.";
      toast.error(errorMessage);
    },
  });
};

export const useDeleteAddress = (addrId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAddress(addrId),
    onSuccess: (data) => {
      const successMsg = data.message || "Address deleted successfully.";
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success(successMsg);
    },
    onError: (error: { response: { data: ErrorResponse } }) => {
      const errorMessage =
        error.response?.data?.error || "Failed to delete address.";
      toast.error(errorMessage);
    },
  });
};
