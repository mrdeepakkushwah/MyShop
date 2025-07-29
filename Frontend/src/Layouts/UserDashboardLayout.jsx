// src/layouts/DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import UserDashboard from "../components/UserDashboard";

const DashboardLayout = () => {
    return (
        <div>
            <UserDashboard />
            <div className="mt-[4.5rem]"> {/* margin to avoid overlap by navbar */}
                <Outlet /> {/* Nested route content will render here */}
            </div>
        </div>
    );
};

export default DashboardLayout;
