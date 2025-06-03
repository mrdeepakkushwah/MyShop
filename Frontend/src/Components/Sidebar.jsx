import React from "react";
import {
    UserCircleIcon,
    ShoppingCartIcon,
    ArrowRightOnRectangleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ open, setOpen, onLogout }) => (
    <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r transition-transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-extrabold text-indigo-600">User Panel</h2>
            <button className="md:hidden" onClick={() => setOpen(false)}>
                <XMarkIcon className="h-6 w-6" />
            </button>
        </div>
        <nav className="flex flex-col gap-3 p-6 text-gray-700">
            <button className="flex items-center gap-2 hover:bg-indigo-100 px-3 py-2 rounded">
                <UserCircleIcon className="h-5 w-5" /> My Profile
            </button>
            <button onClick={() => (window.location.href = "/user/orders")} className="flex items-center gap-2 hover:bg-indigo-100 px-3 py-2 rounded">
                <ShoppingCartIcon className="h-5 w-5" /> My Orders
            </button>
            <button className="flex items-center gap-2 hover:bg-indigo-100 px-3 py-2 rounded">📦 Track Order</button>
            <button className="flex items-center gap-2 hover:bg-indigo-100 px-3 py-2 rounded">🛍️ Products</button>
            <button onClick={onLogout} className="flex items-center gap-2 text-indigo-700 font-semibold hover:bg-indigo-100 px-3 py-2 rounded">
                <ArrowRightOnRectangleIcon className="h-5 w-5" /> Logout
            </button>
        </nav>
        <footer className="p-6 text-xs text-gray-400">© 2025 YourCompany</footer>
    </aside>
);

export default Sidebar;
