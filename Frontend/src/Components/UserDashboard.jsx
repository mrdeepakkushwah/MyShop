import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

import ProductList from "./ProductList";
import Cart from "./Cart";

const UserDashboard = () => {
    const navigate = useNavigate();
    const profileRef = useRef();

    const [userName, setUserName] = useState("");
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartVisible, setCartVisible] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) return navigate("/login");
        setUserName(storedUser.name);

        const fetchProducts = async () => {
            try {
                const res = await axios.get("https://myshop-72k8.onrender.com/products");
                setProducts(res.data.products || []);
            } catch {
                toast.error("Failed to load products.");
            }
        };

        fetchProducts();
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, [navigate]);

    const addToCart = async (product) => {
        const productId = product._id || product.id;
        const existing = cart.find((item) => (item._id || item.id) === productId);

        if (!product.stock || product.stock <= 0) {
            return toast.warn("Out of stock!");
        }

        try {
            const updatedCart = existing
                ? cart.map((item) =>
                    (item._id || item.id) === productId
                        ? { ...item, qty: item.qty + 1 }
                        : item
                )
                : [...cart, { ...product, qty: 1 }];

            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            toast.success(`${product.name} added to cart`);
        } catch (error) {
            console.error("Error updating stock:", error);
            toast.error("Unable to add item. Possibly out of stock.");
        }
    };

    const updateCartItemQty = async (productId, newQty) => {
        const item = cart.find((item) => (item._id || item.id) === productId);
        if (!item || newQty < 1 || newQty === item.qty) return;

        const qtyDiff = newQty - item.qty;

        try {
            await axios.put(`https://myshop-72k8.onrender.com/products/${productId}/update-stock`, {
                qtyChange: qtyDiff,
            });

            const updatedCart = cart.map((item) =>
                (item._id || item.id) === productId ? { ...item, qty: newQty } : item
            );
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
        } catch {
            toast.error("Stock update failed");
        }
    };

    const removeCartItem = async (productId) => {
        const item = cart.find((item) => (item._id || item.id) === productId);
        if (!item) return;

        try {
            await axios.put(`https://myshop-72k8.onrender.com/products/${productId}/update-stock`, {
                qtyChange: -item.qty,
            });

            const updatedCart = cart.filter((i) => (i._id || i.id) !== productId);
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            toast.info("Item removed from cart");
        } catch {
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

    const handleNavigate = (path) => {
        setProfileOpen(false);
        navigate(path);
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(price);

    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-white">
            {/* Navbar */}
            <nav className="flex justify-between items-center px-4 py-3 bg-indigo-600 text-white shadow sticky top-0 z-50">
                <h1 className="text-lg font-bold truncate max-w-xs">
                    Welcome, {userName?.toUpperCase()}
                </h1>

                <div className="flex items-center gap-5 relative" ref={profileRef}>
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-1"
                    >
                        <FaUserCircle className="text-2xl" />
                        <span className="hidden sm:inline font-medium">Profile</span>
                    </button>

                    {profileOpen && (
                        <div className="absolute top-12 right-0 w-48 bg-white text-black border rounded shadow-lg z-50 animate-slide-in">
                            <button onClick={() => handleNavigate("/profile")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                Account
                            </button>
                            <button onClick={() => handleNavigate("/orders")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                My Orders
                            </button>
                            <button onClick={() => handleNavigate("/track-order")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                Track Order
                            </button>
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-100">
                                Logout
                            </button>
                        </div>
                    )}

                    <button onClick={() => setCartVisible(!cartVisible)} className="relative">
                        <FaShoppingCart className="text-2xl" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </nav>

            {/* Main */}
            <main className="flex-1 p-4">
                <ProductList
                    products={products}
                    onAddToCart={addToCart}
                    formatPrice={formatPrice}
                />

                {cartVisible && (
                    <>
                        <div
                            onClick={() => setCartVisible(false)}
                            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
                        />
                        <div className="fixed top-14 right-0 w-80 max-h-[85vh] bg-white z-50 p-4 border-l shadow-xl overflow-y-auto rounded-l-xl animate-slide-in">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-indigo-600">🛒 Your Cart</h2>
                                <button
                                    onClick={() => setCartVisible(false)}
                                    className="text-xl text-red-600 md:hidden"
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

            {/* Footer */}
            <footer className="bg-indigo-700 text-white text-center p-4 mt-auto">
                &copy; {new Date().getFullYear()} MyStore. All rights reserved.
            </footer>

            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

export default UserDashboard;
