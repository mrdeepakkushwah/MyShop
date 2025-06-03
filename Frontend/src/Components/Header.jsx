import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

const Header = ({ userName, onMenuClick }) => (
    <header className="flex items-center justify-between bg-indigo-600 text-white px-6 py-4 shadow-md">
        <button onClick={onMenuClick} className="md:hidden p-2 rounded hover:bg-indigo-500">
            <Bars3Icon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold truncate">Welcome, {userName}</h1>
    </header>
);

export default Header;
