import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import ShopFooter from "./ShopFooter";

export default function MainLayout() {
    const { pathname } = useLocation();

    // Hide footer/navbar on auth pages if needed (optional)
    const hideHeaderFooter = pathname.startsWith("/login") || pathname.startsWith("/signup");

    return (
        <div className="min-h-screen flex flex-col">
            {!hideHeaderFooter && <Navbar />}

            <main className={`flex-grow ${!hideHeaderFooter ? "pt-16" : ""}`}>
                <Outlet />
            </main>

            {!hideHeaderFooter && <ShopFooter />}
        </div>
    );
}
