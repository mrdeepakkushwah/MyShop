// src/context/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Helper to decode JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
}

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If no token → redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Check token expiry
    const decodedToken = parseJwt(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (!decodedToken || decodedToken.exp < currentTime) {
        // Token is expired → auto logout
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        return <Navigate to="/login" replace />;
    }

    // Role check
    if (allowedRoles.length > 0 || !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Authorized → render protected content
    return children;
};

export default PrivateRoute;
