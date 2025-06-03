import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaShoppingCart, FaUserCircle, FaBoxOpen, FaTruck, FaBars } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

import ProductList from "../components/ProductList";
import Cart from "../components/Cart";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [cartVisible, setCartVisible] = useState(false);
    const [cartAnimation, setCartAnimation] = useState("animate-slide-in");
    const [userName, setUserName] = useState("");
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const profileRef = useRef();

    const openCart = () => {
        setCartVisible(true);
        setCartAnimation("animate-slide-in");
        setShowCart(true);
    };

    const closeCart = () => {
        setCartAnimation("animate-slide-out");
        setTimeout(() => {
            setShowCart(false);
            setCartVisible(false);
        }, 300);
    };

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:4000/products");
            setProducts(data.products);
        } catch (error) {
            toast.error("Failed to load products.");
        }
    };

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

        fetchProducts();
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, []);

    const addToCart = (product) => {
        const productId = product.id || product._id;
        const updatedCart = [...cart];
        const existingItem = updatedCart.find(
            (item) => (item.id || item._id) === productId
        );

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            updatedCart.push({ ...product, id: productId, qty: 1 });
        }

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.success(`${product.name} added to cart`);
    };

    const updateCartItemQty = (productId, newQty) => {
        if (newQty < 1) return;
        const updatedCart = cart.map((item) =>
            (item.id || item._id) === productId ? { ...item, qty: newQty } : item
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const removeCartItem = (productId) => {
        const updatedCart = cart.filter(
            (item) => (item.id || item._id) !== productId
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.info("Item removed from cart");
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

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
            <nav className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white shadow sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-2xl">
                        <FaBars />
                    </button>
                    <h1 className="text-xl font-bold">Welcome, {userName}</h1>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={() => (showCart ? closeCart() : openCart())} className="relative">
                        <FaShoppingCart className="text-2xl" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </button>
                    <div className="relative" ref={profileRef}>
                        <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-1">
                            <FaUserCircle className="text-xl" />
                            <span className="hidden sm:inline">My Profile</span>
                        </button>
                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-44 bg-white text-black border rounded-md shadow-lg z-50">
                                <Link to="/profile" className="w-full block px-4 py-2 hover:bg-gray-100 text-left">
                                    Account
                                </Link>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" />
            )}

            <div className="flex flex-1">
                <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 z-40 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}>
                    <h2 className="text-xl font-semibold mb-6 text-indigo-600">📌 Quick Links</h2>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 rounded transition">
                                <FaBoxOpen /> My Orders
                            </Link>
                        </li>
                        <li>
                            <Link to="/track-order" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-green-100 hover:text-green-700 rounded transition">
                                <FaTruck /> Track Order
                            </Link>
                        </li>
                    </ul>
                </aside>

                <main className="flex-1 p-4 mt-4 md:ml-64 transition-all duration-300">
                    <ProductList products={products} onAddToCart={addToCart} formatPrice={formatPrice} />
                    {cartVisible && (
                        <>
                            <div onClick={closeCart} className="fixed inset-0 bg-black bg-opacity-30 z-40" />
                            <div className={`fixed top-20 right-6 w-[350px] max-h-[80vh] overflow-y-auto bg-white shadow-2xl rounded-xl z-50 p-4 border border-gray-200 transition-all duration-300 ${cartAnimation}`}>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold text-indigo-600">🛒 Your Cart</h2>
                                    <button onClick={closeCart} className="text-red-500 hover:text-red-700 text-xl font-bold">&times;</button>
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
            </div>

            <footer className="bg-indigo-700 text-white text-center p-4 mt-auto">
                &copy; {new Date().getFullYear()} MyStore. All rights reserved.
            </footer>

            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

export default UserDashboard;
