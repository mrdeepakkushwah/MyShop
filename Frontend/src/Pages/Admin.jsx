import React, { useState, useEffect } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role?.toLowerCase() === "admin") {
                setAdmin(parsedUser);
            } else {
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setAdmin(null);
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:flex-shrink-0`}
            >
                <div className="flex items-center justify-center h-16 bg-indigo-600">
                    <h1 className="text-white text-xl font-bold">Admin Panel</h1>
                </div>
                <nav className="px-4 py-6">
                    <ul className="space-y-4">
                        <li>
                            <Link
                                to="/admin/dashboard"
                                className="block text-gray-700 hover:text-indigo-600 font-semibold"
                                onClick={() => setSidebarOpen(false)}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/users"
                                className="block text-gray-700 hover:text-indigo-600 font-semibold"
                                onClick={() => setSidebarOpen(false)}
                            >
                                Users
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/products"
                                className="block text-gray-700 hover:text-indigo-600 font-semibold"
                                onClick={() => setSidebarOpen(false)}
                            >
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/orders"
                                className="block text-gray-700 hover:text-indigo-600 font-semibold"
                                onClick={() => setSidebarOpen(false)}
                            >
                                Orders
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin/settings"
                                className="block text-gray-700 hover:text-indigo-600 font-semibold"
                                onClick={() => setSidebarOpen(false)}
                            >
                                Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between bg-white shadow p-4 md:p-6">
                    <button
                        className="md:hidden text-gray-600 hover:text-indigo-600"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle sidebar"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {sidebarOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>

                    <div className="flex items-center space-x-4">
                        {admin && (
                            <div>
                                <p className="text-gray-700 font-semibold">{admin.name}</p>
                                <p className="text-sm text-gray-500">{admin.email}</p>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md transition"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Nested route content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Admin;
