// src/Components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = useSelector((state) => state.auth.user);
    const location = useLocation();

    if (!user) {
        // Not logged in
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Role mismatch
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
