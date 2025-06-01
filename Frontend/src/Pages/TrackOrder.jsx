import React, { useState } from "react";
import { motion } from "framer-motion";

const TrackOrder = () => {
    const [orderId, setOrderId] = useState("");
    const [orderInfo, setOrderInfo] = useState(null);
    const [error, setError] = useState("");

    const mockOrders = {
        ORD001: {
            id: "ORD001",
            date: "2025-05-30",
            items: 3,
            total: 1499,
            status: "Shipped",
            estimatedDelivery: "2025-06-03",
        },
        ORD002: {
            id: "ORD002",
            date: "2025-05-28",
            items: 1,
            total: 499,
            status: "Delivered",
            estimatedDelivery: "2025-05-30",
        },
    };

    const handleTrack = () => {
        if (!orderId) {
            setError("Please enter an Order ID.");
            setOrderInfo(null);
            return;
        }

        const foundOrder = mockOrders[orderId.trim().toUpperCase()];
        if (foundOrder) {
            setOrderInfo(foundOrder);
            setError("");
        } else {
            setOrderInfo(null);
            setError("Order not found. Please check the ID.");
        }
    };

    return (
        <motion.div
            className="p-6 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Enter Order ID (e.g., ORD001)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                />
                <button
                    onClick={handleTrack}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Track
                </button>
            </div>

            {error && <p className="text-red-500 mb-3">{error}</p>}

            {orderInfo && (
                <div className="bg-white p-4 rounded-lg shadow space-y-2">
                    <h4 className="font-semibold text-lg">Order #{orderInfo.id}</h4>
                    <p>Status: <span className="font-medium">{orderInfo.status}</span></p>
                    <p>Order Date: {orderInfo.date}</p>
                    <p>Total Items: {orderInfo.items}</p>
                    <p>Total Amount: ₹{orderInfo.total}</p>
                    <p>Estimated Delivery: {orderInfo.estimatedDelivery}</p>
                </div>
            )}
        </motion.div>
    );
};

export default TrackOrder;
