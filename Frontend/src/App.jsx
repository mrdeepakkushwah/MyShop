import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import ProtectedRoute from "./Components/ProtectedRoute"; // assuming you have it

import Home from "./Pages/Home";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ForgetPassword from "./Pages/ForgetPassword";
import Customer from "./Pages/Customer";
import Dashboard from "./Components/Dashboard";
import UserDashboard from "./Components/UserDashboard";
import OrderHistory from "./Pages/OrderHistory";
import MyOrders from "./Pages/MyOrders";
import TrackOrder from "./Pages/TrackOrder";
import UserProfile from "./Pages/UserProfile";
import Unauthorized from "./Pages/Unauthorized";
import AdminProducts from "./Pages/AdminProducts";
import AdminOrders from "./Pages/AdminOrders";
import AdminSettings from "./Pages/AdminSettings";
import AddProductPage from "./Components/AddProductPage";
import CheckoutPage from "./Pages/CheckoutPage";
import OrderSuccess from "./Pages/OrderSuccess";
import AdminUsers from "./Pages/AdminUsers";

const App = () => {
  return (
    <Routes>
      {/* Public + User Routes wrapped with MainLayout */}
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* Protected Checkout */}
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* User Protected Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/orders"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track-order"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <TrackOrder />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="customers" replace />} />
        <Route path="customers" element={<Customer />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="product/add" element={<AddProductPage />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* Unauthorized & Catch-All */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
