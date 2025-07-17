import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const TrackOrder = () => {
    const [orderId, setOrderId] = useState("");
    const [orderInfo, setOrderInfo] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTrack = async () => {
        if (!orderId) {
            setError("Please enter an Order ID.");
            setOrderInfo(null);
            return;
        }

        setLoading(true);
        setError("");
        setOrderInfo(null);

        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `https://myshop-72k8.onrender.com/getOrderById/${orderId.trim()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.order) {
                setOrderInfo(response.data.order); // ✅ Fix: Access `.order`
            } else {
                setError("Order not found.");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to fetch order.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "shipped":
                return "bg-yellow-100 text-yellow-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    return (
        <motion.div
            className="p-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Enter Order ID (e.g., 665f3796a2...)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                />
                <button
                    onClick={handleTrack}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                >
                    {loading ? "Tracking..." : "Track"}
                </button>
            </div>

            {error && <p className="text-red-500 mb-3">{error}</p>}

            {orderInfo && (
                <div className="bg-white p-4 rounded-lg shadow space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-lg">Order #{orderInfo._id}</h4>
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(orderInfo.status)}`}>
                            {orderInfo.status || "Processing"}
                        </span>
                    </div>

                    <p className="text-sm text-gray-500">
                        Order Date: {orderInfo.createdAt ? new Date(orderInfo.createdAt).toLocaleDateString() : "N/A"}
                    </p>

                    <div className="divide-y">
                        {orderInfo.items?.map((item, index) => (
                            <div key={index} className="py-2 flex items-center gap-4">
                                <img
                                    src={item.image || "/placeholder.jpg"}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md border"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                                </div>
                                <p className="font-semibold">₹{item.price * item.qty}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-right">
                        <p className="text-lg font-bold">Total: ₹{orderInfo.totalAmount || 0}</p>
                        <p className="text-sm text-gray-600">
                            Estimated Delivery:{" "}
                            {orderInfo.createdAt
                                ? new Date(new Date(orderInfo.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
                                : "N/A"}
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default TrackOrder;
