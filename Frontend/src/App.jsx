import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./Components/MainLayout";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Customer from "./Pages/Customer";
import Dashboard from "./Components/Dashboard"; // Admin layout dashboard
import UserDashboard from "./Components/UserDashboard";
import OrderHistory from "./Pages/OrderHistory";
import MyOrders from "./Pages/MyOrders";
import TrackOrder from "./Pages/TrackOrder";
import UserProfile from "./Pages/UserProfile";
import Unauthorized from "./Pages/Unauthorized";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminProducts from "./Pages/AdminProducts";
import AdminOrders from "./Pages/AdminOrders";
import AdminSettings from "./Pages/AdminSettings";
import AddProductPage from "./Components/AddProductPage";
import CheckoutPage from "./Pages/CheckoutPage";
import OrderSuccess from "./Pages/OrderSuccess";
import PrivateRoute from "./context/PrivateRoute";

const  App = ()=> {
  return (
    <Router>
      <Routes>
        {/* Public + User Routes wrapped with MainLayout */}
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* User protected routes */}
          <Route
            path="/user/dashboard"
            element={
              <PrivateRoute allowedRoles={["user", "admin"]}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={["user", "admin"]}>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/orders"
            element={
              <PrivateRoute allowedRoles={["user", "admin"]}>
                <OrderHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute allowedRoles={["user", "admin"]}>
                <MyOrders />
              </PrivateRoute>
            }
          />
          <Route
            path="/track-order"
            element={
              <PrivateRoute allowedRoles={["user", "admin"]}>
                <TrackOrder />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Admin Nested Routes without MainLayout, using Dashboard layout */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<Customer />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="product/add" element={<AddProductPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;