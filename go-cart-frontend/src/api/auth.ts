import { LoginFormValues } from "@/pages/Auth/LoginPage";
import type { SignupFormValues } from "@/pages/Auth/SignupPage";
import { api } from "@/utils/axios";

export const signupUser = async (userData: SignupFormValues) => {
  const res = await api.post("/auth/signup", userData);
  return res.data;
};

export const loginUser = async (userData: LoginFormValues) => {
  const res = await api.post("/auth/login", userData);
  return res.data;
};
