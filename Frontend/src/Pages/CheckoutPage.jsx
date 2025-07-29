import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CheckoutPage = ({ setCart }) => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [cart, setCartState] = useState(() => {
        const localCart = localStorage.getItem("cart");
        return state?.cart || (localCart ? JSON.parse(localCart) : []);
    });

    const [totalPrice, setTotalPrice] = useState(() => {
        if (state?.totalPrice) return state.totalPrice;
        const localCart = localStorage.getItem("cart");
        if (!localCart) return 0;
        const parsed = JSON.parse(localCart);
        return parsed.reduce((sum, item) => sum + item.qty * item.price, 0);
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [shipping, setShipping] = useState({
        name: "",
        address: "",
        city: "",
        zip: "",
    });

    const handleChange = (e) => {
        setShipping({ ...shipping, [e.target.name]: e.target.value });
    };

    const placeOrder = async () => {
        if (cart.length === 0) return setError("Cart is empty");
        if (!shipping.name || !shipping.address || !shipping.city || !shipping.zip) {
            return setError("Please fill all shipping fields");
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("You must be logged in to place an order.");
                setLoading(false);
                return;
            }

            // Step 1: Update stock for all products
            await Promise.all(
                cart.map((item) => {
                    const productId = item._id || item.id;
                    if (!productId) {
                        console.warn("Missing productId for stock update", item);
                        return;
                    }
                    return axios.put(
                        `https://myshop-72k8.onrender.com/products/${productId}/update-stock`,
                        { qtyChange: item.qty },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                })
            );

            // Step 2: Save the order to backend
         const res =  await axios.post(
                "https://myshop-72k8.onrender.com/orders/place",
                {
                    items: cart,
                    shipping,
                    totalAmount:totalPrice,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(res);
            localStorage.removeItem("cart");
            setCartState([]);
            if (typeof setCart === "function") setCart([]);
            navigate("/order-success");
        } catch (err) {
            console.error("Checkout error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Checkout failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Checkout
            </h2>

            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 transition hover:shadow-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Shipping Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="input-style"
                        value={shipping.name}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="input-style"
                        value={shipping.address}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        className="input-style"
                        value={shipping.city}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="zip"
                        placeholder="ZIP Code"
                        className="input-style"
                        value={shipping.zip}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 transition hover:shadow-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h3>
                <ul className="divide-y divide-gray-200 mb-4">
                    {cart.map((item) => (
                        <li
                            key={item._id || item.id}
                            className="py-4 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    Qty: {item.qty} × ₹{item.price}
                                </p>
                            </div>
                            <p className="text-lg font-semibold text-gray-700">
                                ₹{item.qty * item.price}
                            </p>
                        </li>
                    ))}
                </ul>

                <div className="text-right">
                    <p className="text-lg font-bold text-gray-800 mb-1">
                        Total: ₹{totalPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 italic animate-pulse">
                        Delivery estimate: 5-7 business days
                    </p>
                </div>
            </div>

            {/* Place Order Button */}
            <button
                onClick={placeOrder}
                disabled={loading}
                className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-medium transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {loading ? "Placing Order..." : "Place Order"}
            </button>
        </div>
    );
};

export default CheckoutPage;
