import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`https://myshop-72k8.onrender.com/orders/${user._id}`);
                setOrders(res.data.orders || []);
            } catch (err) {
                console.error("Error fetching orders", err);
            }
        };
        fetchOrders();
    }, [user._id]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">My Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-lg shadow p-4 border border-gray-200"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Order #{order._id.slice(-6)}
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {format(new Date(order.createdAt), "dd MMM yyyy")}
                                </span>
                            </div>
                            <ul className="mt-2 text-sm text-gray-700">
                                {order.products.map((p) => (
                                    <li key={p.productId}>
                                        {p.name} × {p.qty} – ₹{p.price * p.qty}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-2 text-right text-indigo-600 font-medium">
                                Total: ₹{order.total}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
