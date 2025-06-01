import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./Components/MainLayout";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Customer from "./Pages/Customer";
import Dashboard from "./Components/Dashboard";
import UserDashboard from "./Components/UserDashboard";
import OrderHistory from './Pages/OrderHistory'
import MyOrders from './Pages/MyOrders';
import TrackOrder from "./Pages/TrackOrder";
import UserProfile from "./Pages/UserProfile";


import AdminDashboard from "./Pages/AdminDashboard";
import AdminUsers from "./Pages/AdminUsers";
import AdminProducts from "./Pages/AdminProducts";
import AdminOrders from "./Pages/AdminOrders";
import AdminSettings from "./Pages/AdminSettings";

import PrivateRoute from "./Components/PrivateRoute";
import AddProductPage from "./Components/AddProductPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Site Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/customer" element={<Customer />} />
        </Route>

        {/* Protected Admin Dashboard Layout */}
        <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<Customer />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="product/add" element={<AddProductPage />} />
        </Route>

        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/user/orders" element={<OrderHistory />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/track-order" element={<TrackOrder />} />
      </Routes>
    </Router>
  );
}

export default App;
