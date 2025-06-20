import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//  add token to every request
api.interceptors.request.use(
  (config) => {
    const { user } = useAuthStore.getState();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid token
api.interceptors.response.use(
  (res)=> res,
  (err) =>{
    const errMsg = err.response?.data?.error;
     if (
      err.response?.status === 401 &&
      (errMsg === "invalid or expired token" || errMsg === "token mismatch")
    ) {
      const store = useAuthStore.getState();
      store.clearUser();
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
)