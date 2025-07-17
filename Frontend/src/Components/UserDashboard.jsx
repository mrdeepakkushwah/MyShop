import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
    FaShoppingCart,
    FaUserCircle,
    FaBoxOpen,
    FaTruck,
    FaBars,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

import ProductList from "./ProductList";
import Cart from "./Cart";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [cartVisible, setCartVisible] = useState(false);
    const [userName, setUserName] = useState("");
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [profileOpen, setProfileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const profileRef = useRef();

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch user & products on mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return navigate("/login");
        setUserName(storedUser.name);

        const fetchProducts = async () => {
            try {
                const { data } = await axios.get("http://localhost:4000/products");
                setProducts(data.products);
            } catch (error) {
                toast.error("Failed to load products.");
            }
        };
        fetchProducts();

        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, [navigate]);

    // const addToCart = (product) => {
    //     const productId = product.id || product._id;
    //     const updatedCart = [...cart];
    //     const existingItem = updatedCart.find(
    //         (item) => (item.id || item._id) === productId
    //     );

    //     if (existingItem) {
    //         existingItem.qty += 1;
    //     } else {
    //         updatedCart.push({ ...product, id: productId, qty: 1 });
    //     }

    //     setCart(updatedCart);
    //     localStorage.setItem("cart", JSON.stringify(updatedCart));
    //     toast.success(`${product.name} added to cart`);
    // };

    const addToCart = async (product) => {
        const productId = product._id || product.id;
        const updatedCart = [...cart];
        const existingItem = updatedCart.find((item) => item._id === productId);

        // Prevent adding if stock is 0
        if (product.stock <= 0) {
            return toast.warn("Out of stock!");
        }

        try {
            // Call backend to reduce stock
            await axios.put(`https://myshop-72k8.onrender.com/products/${productId}/update-stock`, {
                qtyChange: 1,
            });

            if (existingItem) {
                existingItem.qty += 1;
            } else {
                updatedCart.push({ ...product, qty: 1 });
            }

            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            toast.success(`${product.name} added to cart`);
        } catch (error) {
            toast.error("Unable to add item. Possibly out of stock.");
        }
    };
      
    // const updateCartItemQty = (productId, newQty) => {
    //     if (newQty < 1) return;
    //     const updatedCart = cart.map((item) =>
    //         (item.id || item._id) === productId ? { ...item, qty: newQty } : item
    //     );
    //     setCart(updatedCart);
    //     localStorage.setItem("cart", JSON.stringify(updatedCart));
    // };
    const updateCartItemQty = async (productId, newQty) => {
        const item = cart.find((item) => item._id === productId);
        if (!item) return;

        const qtyDiff = newQty - item.qty;
        if (newQty < 1 || qtyDiff === 0) return;

        try {
            // Backend update: decrease or increase stock
            await axios.put(`https://myshop-72k8.onrender.com/products/${productId}/update-stock`, {
                qtyChange: qtyDiff,
            });

            const updatedCart = cart.map((item) =>
                item._id === productId ? { ...item, qty: newQty } : item
            );
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        } catch (error) {
            toast.error("Stock update failed");
        }
    };
      
    // const removeCartItem = (productId) => {
    //     const updatedCart = cart.filter(
    //         (item) => (item.id || item._id) !== productId
    //     );
    //     setCart(updatedCart);
    //     localStorage.setItem("cart", JSON.stringify(updatedCart));
    //     toast.info("Item removed from cart");
    // };

    const removeCartItem = async (productId) => {
        const item = cart.find((item) => item._id === productId);
        if (!item) return;

        try {
            await axios.put(`https://myshop-72k8.onrender.com/products/${productId}/update-stock`, {
                qtyChange: -item.qty,
            });

            const updatedCart = cart.filter((i) => i._id !== productId);
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            toast.info("Item removed from cart");
        } catch (error) {
            toast.error("Failed to restore stock");
        }
    };
      
    const handleCheckout = () => {
        if (!cart.length) return toast.warning("Your cart is empty.");
        navigate("/checkout", { state: { cart } });
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(price);

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
            {/* NAVBAR */}
            <nav className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white shadow sticky top-0 z-50">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Welcome and username - truncate with ellipsis on small screens */}
                    <h1 className="text-lg sm:text-xl font-bold truncate max-w-full min-w-0">
                        Welcome, {userName.toUpperCase()}
                    </h1>
                </div>

                <div className="flex items-center gap-6 relative" ref={profileRef}>
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-1 focus:outline-none"
                        aria-haspopup="true"
                        aria-expanded={profileOpen}
                        aria-label="User Profile Menu"
                    >
                        <FaUserCircle className="text-2xl" />
                        <span className="hidden sm:inline ml-1 font-medium">My Profile</span>
                    </button>

                    {profileOpen && (
                        <div
                            className="absolute top-8 right-0 mt-2 w-48 bg-white text-black border rounded-md shadow-lg z-50"
                            role="menu"
                        >
                            <Link
                                to="/profile"
                                className="block px-4 py-2 hover:bg-gray-100 text-left"
                                role="menuitem"
                            >
                                Account
                            </Link>
                            <Link
                                to="/orders"
                                className="block px-4 py-2 hover:bg-indigo-100 text-left text-indigo-700 font-semibold"
                                role="menuitem"
                            >
                                My Orders
                            </Link>
                            <Link
                                to="/track-order"
                                className="block px-4 py-2 hover:bg-green-100 text-left text-green-700 font-semibold"
                                role="menuitem"
                            >
                                Track Order
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                role="menuitem"
                            >
                                Logout
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => setCartVisible(!cartVisible)}
                        className="relative text-2xl focus:outline-none"
                        aria-label="Cart"
                    >
                        <FaShoppingCart />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-2 mt-4 md:ml-50 transition-all duration-300">
                <ProductList
                    products={products}
                    onAddToCart={addToCart}
                    formatPrice={formatPrice}
                />

                {/* CART PANEL */}
                {cartVisible && (
                    <>
                        {/* Overlay for mobile */}
                        <div
                            onClick={() => setCartVisible(false)}
                            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
                        />
                        <div
                            className="fixed top-12 right-0 w-80 max-h-full overflow-y-auto bg-white shadow-2xl rounded-l-xl z-50 p-4 border border-gray-200 transition-transform duration-300
            transform translate-x-0 md:translate-x-0"
                            style={{ height: "90vh" }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-indigo-600">🛒 Your Cart</h2>
                                <button
                                    onClick={() => setCartVisible(false)}
                                    className="text-red-500 hover:text-red-700 text-xl font-bold md:hidden"
                                    aria-label="Close Cart"
                                >
                                    &times;
                                </button>
                            </div>
                            <Cart
                                cart={cart}
                                updateQty={updateCartItemQty}
                                removeItem={removeCartItem}
                                handleCheckout={handleCheckout}
                                formatPrice={formatPrice}
                                totalPrice={totalPrice}
                            />
                        </div>
                    </>
                )}
            </main>

            {/* FOOTER */}
            <footer className="bg-indigo-700 text-white text-center p-4 mt-auto">
                &copy; {new Date().getFullYear()} MyStore. All rights reserved.
            </footer>

            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

export default UserDashboard;
