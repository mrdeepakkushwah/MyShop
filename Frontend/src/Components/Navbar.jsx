import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userRole, setUserRole] = useState(null); // "admin" | "user" | null

    const location = useLocation();
    const navigate = useNavigate();

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const handleNavClick = () => {
        setMenuOpen(false);
        setDropdownOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("role");
        setUserRole(null);
        navigate("/login");
    };

    useEffect(() => {
        const role = localStorage.getItem("role");
        setUserRole(role);
    }, [location]);

    const navLinkClass = ({ isActive }) =>
        isActive ? "text-indigo-600 font-semibold" : "text-gray-700 hover:text-indigo-600";

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" onClick={handleNavClick} className="text-2xl font-bold text-indigo-600">
                        MyShop
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <NavLink to="/" className={navLinkClass}>Home</NavLink>
                        <NavLink to="/about" className={navLinkClass}>About</NavLink>

                        {/* Account Dropdown */}
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="text-gray-700 hover:text-indigo-600 focus:outline-none"
                            >
                                Account ▼
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border z-10">
                                    {userRole === "admin" ? (
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                            Logout
                                        </button>
                                    ) : userRole === "user" ? (
                                        <>
                                            <Link to="/profile" onClick={handleNavClick} className="block px-4 py-2 hover:bg-gray-100">
                                                Profile
                                            </Link>
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" onClick={handleNavClick} className="block px-4 py-2 hover:bg-gray-100">
                                                Login
                                            </Link>
                                            <Link to="/signup" onClick={handleNavClick} className="block px-4 py-2 hover:bg-gray-100">
                                                Signup
                                            </Link>
                                            {/* <Link to="/admin" onClick={handleNavClick} className="block px-4 py-2 hover:bg-gray-100">
                                                Admin
                                            </Link> */}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
                            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white shadow-md border-t">
                    <NavLink to="/" onClick={handleNavClick} className="block px-4 py-2 hover:bg-gray-100">
                        Home
                    </NavLink>
                    <NavLink to="/about" onClick={handleNavClick} className="block px-4 py-2 hover:bg-gray-100">
                        About
                    </NavLink>

                    <div className="border-t mt-2">
                        <p className="px-4 pt-2 text-gray-700 font-semibold">Account</p>
                        {userRole === "admin" ? (
                            <button onClick={handleLogout} className="w-full text-left px-6 py-2 hover:bg-gray-100">
                                Logout
                            </button>
                        ) : userRole === "user" ? (
                            <>
                                <Link to="/profile" onClick={handleNavClick} className="block px-6 py-2 hover:bg-gray-100">
                                    Profile
                                </Link>
                                <button onClick={handleLogout} className="w-full text-left px-6 py-2 hover:bg-gray-100">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={handleNavClick} className="block px-6 py-2 hover:bg-gray-100">
                                    Login
                                </Link>
                                <Link to="/signup" onClick={handleNavClick} className="block px-6 py-2 hover:bg-gray-100">
                                    Signup
                                </Link>
                                {/* <Link to="/admin" onClick={handleNavClick} className="block px-6 py-2 hover:bg-gray-100">
                                    Admin
                                </Link> */}
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
