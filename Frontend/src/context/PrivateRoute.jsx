import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
    const { authUser } = useContext(AuthContext);

    if (!authUser) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(authUser.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default PrivateRoute;
