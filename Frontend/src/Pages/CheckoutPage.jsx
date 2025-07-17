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

    // const placeOrder = async () => {
    //     if (cart.length === 0) {
    //         setError("Cart is empty");
    //         return;
    //     }

    //     setLoading(true);
    //     setError("");

    //     try {
    //         const token = localStorage.getItem("token");

    //         const response = await axios.post(
    //             "http://localhost:4000/addOrders",
    //             {
    //                 items: cart.map(item => ({
    //                     productId: item._id || item.id,
    //                     name: item.name,
    //                     image: item.image,
    //                     qty: item.qty,
    //                     price: item.price,
    //                 })),
    //                 totalAmount: totalPrice,
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );

    //         // Clear local cart
    //         localStorage.removeItem("cart");
    //         setCartState([]);
    //         if (typeof setCart === "function") {
    //             setCart([]); // Only call if passed from parent
    //         }

    //         navigate("/order-success");
    //     } catch (err) {
    //         console.error("Checkout error:", err.response?.data || err.message);
    //         setError(err.response?.data?.message || err.message || "Something went wrong");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const placeOrder = async () => {
        if (cart.length === 0) {
            setError("Cart is empty");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            // Step 1: Place the order
            const response = await axios.post(
                "https://myshop-72k8.onrender.com/addOrders",
                {
                    items: cart.map(item => ({
                        productId: item._id || item.id,
                        name: item.name,
                        image: item.image,
                        qty: item.qty,
                        price: item.price,
                    })),
                    totalAmount: totalPrice,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Step 2: Update product stock for each item
            for (const item of cart) {
                const itemId = item._id || item.id;
                await axios.put(
                    `http://localhost:4000/products/${itemId}/update-stock`,
                    { qtyChange: item.qty },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            // Step 3: Clear cart
            localStorage.removeItem("cart");
            setCartState([]);
            if (typeof setCart === "function") setCart([]);

            navigate("/order-success");
        } catch (err) {
            console.error("Checkout error:", err.response?.data || err.message);
            setError(err.response?.data?.message || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            {error && <p className="text-red-600 mb-2">{error}</p>}

            <ul className="space-y-4 border-b pb-4 mb-4">
                {cart.map((item) => (
                    <li key={item._id || item.id} className="flex justify-between items-start">
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                                Qty: {item.qty} × ₹{item.price}
                            </p>
                        </div>
                        <p className="font-semibold">₹{item.qty * item.price}</p>
                    </li>
                ))}
            </ul>

            <p className="text-xl font-bold mb-6 text-right">Total: ₹{totalPrice}</p>

            <button
                onClick={placeOrder}
                disabled={loading}
                className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded transition ${loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
            >
                {loading ? "Placing Order..." : "Place Order"}
            </button>
        </div>
    );
};

export default CheckoutPage;
