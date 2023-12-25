import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import Dashboard from "components/dashboard/Dashboard";
import LoginPage from "components/login/LoginPage";
import Layout from "components/layout/Layout";
import NotFound from "components/errorPages/notFound/NotFound";
import Profile from "components/profile/Profile";
import SignUpPage from "components/login/Signup";
import CompanySetting from "domains/companySetting/pages/CompanySetting";
import Company from "domains/company/pages/Company";
import CompanyCrud from "domains/company/pages/CompanyCrud";
import Products from "domains/products/pages/Products";
import ProductsCrud from "domains/products/pages/ProductsCrud";
import MeasurementUnit from "domains/measurementUnit/pages/MeasurementUnit";
import MeasurementUnitCrud from "domains/measurementUnit/pages/MeasurementUnitCrud";

const AppRoutes: React.FC = () => {
  const Auth = useAuth();
  const isUserLoggedInd = Auth?.isUserLoggedIn;
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/company">
          <Route index element={<Company />} />
          <Route path="new" element={<CompanyCrud />} />
          <Route path=":companyId" element={<CompanyCrud />} />
        </Route>
        <Route path="/products">
          <Route index element={<Products />} />
          <Route path="new" element={<ProductsCrud />} />
          <Route path=":productId" element={<ProductsCrud />} />
        </Route>
        <Route path="/measurement-unit">
          <Route index element={<MeasurementUnit />} />
          <Route path="new" element={<MeasurementUnitCrud />} />
          <Route path=":id" element={<MeasurementUnitCrud />} />
        </Route>
        <Route path="/company-setting" element={<CompanySetting />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="login" index element={isUserLoggedInd ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="sign-up" index element={isUserLoggedInd ? <Navigate to="/dashboard" /> : <SignUpPage />} />
      <Route path="*" element={<Navigate to="login" />} />
    </Routes>
  );
};

export default AppRoutes;

type ProtectedRouteProps = {
  redirectPath?: string;
  children?: React.ReactElement;
};
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = "/login", children }) => {
  const Auth = useAuth();
  if (!Auth?.isUserLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Layout>{children ? children : <Outlet />}</Layout>;
};
