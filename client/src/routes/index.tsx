import { lazy } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import AuthLayout from "../pages/auth/layout";
import AuthRoutes from "./auth";
import AuthGuard from "@/components/auth/guard";
import HomePage from "@/pages/home";
import MobilesPage from "@/pages/mobiles";
import DetailProduct from "@/pages/detail-product";
import CartPage from "@/pages/cart";
import PaymentRoutes from "./payment";
import WarrantyPage from "@/pages/warranty";

const Interrupts = lazy(() => import("../pages/error/interrupts"));
const Forbidden = lazy(() => import("../pages/error/forbidden"));
const NotFound = lazy(() => import("../pages/not-found"));

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/mobiles/:productId" element={<MobilesPage />} />
        <Route path="/mobile/:productId/:skuId" element={<DetailProduct />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/warranty" element={<WarrantyPage />} />

        <Route path="payment/*" element={<PaymentRoutes />} />


        <Route element={<AuthLayout />}>
          <Route path="auth/*" element={<AuthRoutes />} />
        </Route>

        <Route element={<AuthGuard />}></Route>

        <Route path="interrupts" element={<Interrupts />} />
        <Route path="forbidden" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
