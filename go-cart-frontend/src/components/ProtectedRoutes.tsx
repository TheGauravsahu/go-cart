import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
