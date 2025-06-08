import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import Home from "./Pages/Home";
import Loader from "./Components/Loader"; // Create a simple loading spinner

// Lazy-loaded components
const About = React.lazy(() => import("./Pages/About"));
const Login = React.lazy(() => import("./Pages/Login"));
const Signup = React.lazy(() => import("./Pages/Signup"));
const Customer = React.lazy(() => import("./Pages/Customer"));
const Dashboard = React.lazy(() => import("./Components/Dashboard"));
const UserDashboard = React.lazy(() => import("./Components/UserDashboard"));
const OrderHistory = React.lazy(() => import("./Pages/OrderHistory"));
const MyOrders = React.lazy(() => import("./Pages/MyOrders"));
const TrackOrder = React.lazy(() => import("./Pages/TrackOrder"));
const UserProfile = React.lazy(() => import("./Pages/UserProfile"));
const Unauthorized = React.lazy(() => import("./Pages/Unauthorized"));
const AdminDashboard = React.lazy(() => import("./Pages/AdminDashboard"));
const AdminProducts = React.lazy(() => import("./Pages/AdminProducts"));
const AdminOrders = React.lazy(() => import("./Pages/AdminOrders"));
const AdminSettings = React.lazy(() => import("./Pages/AdminSettings"));
const AddProductPage = React.lazy(() => import("./Components/AddProductPage"));
const CheckoutPage = React.lazy(() => import("./Pages/CheckoutPage"));
const OrderSuccess = React.lazy(() => import("./Pages/OrderSuccess"));
const PrivateRoute = React.lazy(() => import("./context/PrivateRoute"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public + User Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* User Protected Routes */}
            <Route
              path="/user/dashboard"
              element={
                <PrivateRoute allowedRoles={["user", "admin"]}>
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            {/* ... other user routes ... */}
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Dashboard />
              </PrivateRoute>
            }
          >
            {/* ... admin sub-routes ... */}
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;