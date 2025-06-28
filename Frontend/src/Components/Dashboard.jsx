import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import {
    LogOut,
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    Settings,
    PlusCircle,
    Menu,
    X,
} from "lucide-react";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                // Clear corrupted data and redirect
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navItems = [
        { name: "Dashboard", to: "dashboard", icon: LayoutDashboard },
        { name: "Customers", to: "customers", icon: Users },
        { name: "Products", to: "products", icon: Package },
        { name: "Orders", to: "orders", icon: ShoppingCart },
        { name: "Settings", to: "settings", icon: Settings },
        { name: "Add Product", to: "product/add", icon: PlusCircle },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-indigo-700 text-white p-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center space-x-3">
                    <button
                        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                        className="md:hidden focus:outline-none"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className="rounded-full border w-10 h-10 flex items-center justify-center bg-blue-600 font-semibold text-lg">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="text-xl font-semibold">Admin Panel</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <span className="hidden sm:inline font-medium">
                        Welcome, {userName.toUpperCase()}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-indigo-900 hover:bg-indigo-950 px-3 py-1 rounded-md flex items-center gap-2"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 flex-col md:flex-row">
                {/* Sidebar */}
                <nav
                    className={`bg-white md:block shadow-md w-full md:w-64 p-4 transition-all  sm:sticky top-0 z-0 duration-300 z-40 md:static absolute ${isSidebarOpen ? "block" : "hidden"
                        }`}
                >
                    <ul className="space-y-4">
                        {navItems.map(({ name, to, icon: Icon }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-3 px-3 py-2 rounded-md font-medium ${isActive
                                            ? "text-indigo-600 bg-indigo-100"
                                            : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-100"
                                        }`
                                    }
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <Icon size={18} />
                                    <span>{name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Main content */}
                <main className="flex-1 bg-white p-4 md:p-6">
                    <Outlet />
                </main>
            </div>

            {/* Footer */}
            <footer className="text-center text-gray-500 text-sm py-4">
                © 2025 My Shop. All rights reserved.
            </footer>
        </div>
    );
};

export default Dashboard;
