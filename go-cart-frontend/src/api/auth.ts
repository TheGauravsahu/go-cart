import { LoginFormValues } from "@/pages/Auth/LoginPage";
import type { SignupFormValues } from "@/pages/Auth/SignupPage";
import { ProfileFormValues } from "@/pages/Profile/ProfileForm";
import { api } from "@/utils/axios";

export const signupUser = async (userData: SignupFormValues) => {
  const res = await api.post("/auth/signup", userData);
  return res.data;
};

export const loginUser = async (userData: LoginFormValues) => {
  const res = await api.post("/auth/login", userData);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const editProfile = async (data: ProfileFormValues) => {
  const res = await api.post("/users/me", data);
  return res.data;
};
