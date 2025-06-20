import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import Layout from "../components/Layout";
import ProductsPage from "../pages/Products/ProductsPage";
import NotFoundPage from "@/pages/NotFound/NotFoundPage";
import ProductDetailsPage from "@/pages/ProductDetails/ProductDetailsPage";
import SignupPage from "@/pages/Auth/SignupPage";
import LoginPage from "@/pages/Auth/LoginPage";
import CartPage from "@/pages/Cart/CartPage";
import ProfilePage from "@/pages/Profile/ProfilePage";
import ProfileLayout from "@/components/ProfileLayout";
import ListAddresses from "@/pages/Profile/Addresses/ListAddresses";
import ProtectedRoutes from "@/components/ProtectedRoutes";

const AppRoutes = () => (
<Router>
  <Layout>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/p/:id" element={<ProductDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />

      {/* Auth Routes */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage isModal={false} />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<ProfilePage />} />
          <Route path="addresses" element={<ListAddresses />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Layout>
</Router>
);
export default AppRoutes;
