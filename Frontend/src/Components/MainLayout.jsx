import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import ShopFooter from "./ShopFooter";

export default function MainLayout() {
    const { pathname } = useLocation();

    // Show Navbar only on Home page
    const showNavbar = pathname === "/";

    // Hide Footer on login/signup
    const hideFooter = pathname.startsWith("/login") || pathname.startsWith("/signup");

    return (
        <div className="min-h-screen flex flex-col">
            {showNavbar && <Navbar />}

            <main className="flex-grow">
                <Outlet />
            </main>

            {!hideFooter && <ShopFooter />}
        </div>
    );
}
