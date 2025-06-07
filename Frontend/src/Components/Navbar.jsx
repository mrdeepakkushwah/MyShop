import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userRole, setUserRole] = useState(null); // "admin" | "user" | null

    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef();

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdown & menu on navigation change
    useEffect(() => {
        setDropdownOpen(false);
        setMenuOpen(false);
        const role = localStorage.getItem("role");
        setUserRole(role);
    }, [location]);

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    const handleLogout = () => {
        localStorage.removeItem("role");
        setUserRole(null);
        setDropdownOpen(false);
        navigate("/login");
    };

    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-indigo-600 font-semibold"
            : "text-gray-700 hover:text-indigo-600";

    return (
        <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold text-indigo-600"
                        onClick={() => setMenuOpen(false)}
                    >
                        MyShop
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <NavLink to="/" className={navLinkClass}>
                            Home
                        </NavLink>
                        <NavLink to="/about" className={navLinkClass}>
                            About
                        </NavLink>

                        {/* Account Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                aria-haspopup="true"
                                aria-expanded={dropdownOpen}
                                className="flex items-center text-gray-700 hover:text-indigo-600 focus:outline-none"
                            >
                                <FaUserCircle className="text-2xl mr-2" />
                                Account
                                <svg
                                    className={`ml-1 w-4 h-4 transform transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-30 animate-fade-slide origin-top-right">
                                    <div className="dropdown-arrow"></div>
                                    {userRole === "admin" ? (
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    ) : userRole === "user" ? (
                                        <>
                                            <Link
                                                to="/profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                onClick={() => setDropdownOpen(false)}
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/signup"
                                                onClick={() => setDropdownOpen(false)}
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                Signup
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                            className="text-gray-700 focus:outline-none"
                        >
                            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white shadow-md border-t">
                    <NavLink
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="block px-6 py-3 border-b border-gray-200 hover:bg-gray-100"
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/about"
                        onClick={() => setMenuOpen(false)}
                        className="block px-6 py-3 border-b border-gray-200 hover:bg-gray-100"
                    >
                        About
                    </NavLink>

                    <div className="border-t mt-2">
                        <p className="px-6 pt-3 text-gray-700 font-semibold">Account</p>
                        {userRole === "admin" ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }}
                                className="w-full text-left px-6 py-3 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        ) : userRole === "user" ? (
                            <>
                                <Link
                                    to="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-6 py-3 hover:bg-gray-100"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMenuOpen(false);
                                    }}
                                    className="w-full text-left px-6 py-3 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-6 py-3 hover:bg-gray-100"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-6 py-3 hover:bg-gray-100"
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
