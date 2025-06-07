import React, { useEffect, useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.role !== "admin") {
                    navigate("/login");
                } else {
                    setUserName(parsedUser.name || "User");
                }
            } catch (err) {
                console.error("Error parsing user data:", err);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);
    
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token"); // keep this if you're using JWT
        navigate("/login");
    };
    
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
                {/* Logo and site name */}
                <div className="flex items-center space-x-3">
                    <h1 className="rounded-full border border-gray-300 w-10 h-10 flex items-center justify-center bg-blue-600 text-white font-semibold text-lg cursor-pointer hover:bg-blue-700 transition duration-200">
                        {userName.charAt(0).toUpperCase()}
                    </h1>

                 <h1 className="text-xl font-semibold">Admin Panel</h1>
                </div>

                {/* User info + Logout */}
                <div className="flex items-center space-x-4">
                    <span className="font-medium">Welcome, {(userName).toUpperCase()}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-indigo-800 hover:bg-indigo-900 px-3 py-1 rounded-md transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="flex flex-1 flex-col md:flex-row p-6 gap-6">
                {/* Sidebar */}
                <nav className="bg-white rounded-lg shadow-md md:w-1/6 p-4">
                    <ul className="space-y-3 text-gray-700">
                        <li>
                            <Link
                                to="dashboard"
                                className="block hover:text-indigo-600 font-medium"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="customers"
                                className="block hover:text-indigo-600 font-medium"
                            >
                                Customers
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="products"
                                className="block hover:text-indigo-600 font-medium"
                            >
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="orders"
                                className="block hover:text-indigo-600 font-medium"
                            >
                                Orders
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="settings"
                                className="block hover:text-indigo-600 font-medium"
                            >
                                Settings
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="product/add"
                                className="block hover:text-indigo-600 font-medium"
                            >
                                Add Products
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Content area */}
                <section className="bg-white rounded-lg shadow-md flex-1 p-6 overflow-auto">
                    <Outlet />
                </section>
            </main>

            {/* Footer */}
            <footer className="text-center text-gray-500 text-sm py-4">
                © 2025 My Shop. All rights reserved.
            </footer>
        </div>
    );
};

export default Dashboard;
