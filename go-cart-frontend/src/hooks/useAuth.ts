import { editProfile, getProfile, loginUser, signupUser } from "@/api/auth";
import { LoginFormValues } from "@/pages/Auth/LoginPage";
import type { SignupFormValues } from "@/pages/Auth/SignupPage";
import { ProfileFormValues } from "@/pages/Profile/ProfileForm";
import { useAuthStore } from "@/store/authStore";
import type { ApiResponse, ErrorResponse } from "@/types/apiRes.types";
import { User } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: SignupFormValues) => signupUser(data),
    onSuccess: (data: ApiResponse<string>) => {
      const successMessage = data.message || "Signup successful!";
      toast.success(successMessage);
      navigate("/login");
    },
    onError: (error: { response: { data: ErrorResponse } }) => {
      const errorMessage = error.response?.data?.error || "Signup failed.";
      toast.error(errorMessage);
    },
  });
};

export const useLogin = (isModal: boolean, onSuccessCallback?: () => void) => {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormValues) => loginUser(data),
    onSuccess: (data: ApiResponse<{ user: User }>) => {
      setUser(data.data?.user as User);
      const successMessage = data.message || "Login successful!";
      toast.success(successMessage);
      onSuccessCallback?.();
      if (!isModal) {
        navigate("/");
      }
    },
    onError: (error: { response: { data: ErrorResponse } }) => {
      const errorMessage = error.response?.data?.error || "Login failed.";
      toast.error(errorMessage);
    },
  });
};

export const useProfile = () => {
  return useQuery<User>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};

export const useEditProfile = (onSuccessCallback?: () => void) => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileFormValues) => editProfile(data),
    onSuccess: (data: ApiResponse<{ user: User }>) => {
      setUser(data.data?.user as User);

      const successMessage = data.message || "Profile updated successful!";
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      onSuccessCallback?.();
    },
    onError: (error: { response: { data: ErrorResponse } }) => {
      const errorMessage =
        error.response?.data?.error || "Failed to update profile.";
      toast.error(errorMessage);
    },
  });
};
