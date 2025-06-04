import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:4000/getOrders", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(Array.isArray(response.data) ? response.data : response.data.orders || []);
            } catch (err) {
                console.error("Order fetch error:", err);
                setError("Failed to fetch orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <motion.div
            className="p-4 md:p-6 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">My Orders</h2>

            {loading ? (
                <p className="text-gray-500 text-center animate-pulse">Fetching your orders...</p>
            ) : error ? (
                <p className="text-red-600 text-center">{error}</p>
            ) : orders.length === 0 ? (
                <p className="text-gray-500 text-center">You have no orders yet.</p>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4 p-4 md:p-6">
                                {/* Order Summary */}
                                <div className="flex-1">
                                    <div className="text-sm text-gray-500 mb-1">
                                        <span className="font-medium text-gray-700">Order ID:</span> {order._id}
                                    </div>
                                    <div className="text-sm text-gray-500 mb-3">
                                        <span className="font-medium text-gray-700">Date:</span>{" "}
                                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </div>

                                    <div className="divide-y">
                                        {order.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-4 py-2"
                                            >
                                                <img
                                                    src={item.image || "/placeholder.jpg"}
                                                    alt={item.name}
                                                    className="w-14 h-14 rounded-md object-cover border"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Qty: {item.qty}
                                                    </p>
                                                </div>
                                                <div className="text-sm font-semibold text-gray-700">
                                                    ₹{(item.qty || 1) * (item.price || 0)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Total and Status */}
                                <div className="flex flex-col justify-between items-end text-right gap-3">
                                    <div>
                                        <p className="text-lg font-bold text-indigo-600">
                                            ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                                        </p>
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                    </div>
                                    <div>
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium
                                            ${order.status === "Delivered"
                                                ? "bg-green-100 text-green-700"
                                                : order.status === "Shipped"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-700"}`}>
                                            {order.status || "Processing"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default MyOrders;
