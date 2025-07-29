// AdminOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const ordersPerPage = 6;

    const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    const statusColors = {
        Delivered: "bg-green-100 text-green-700 border border-green-300",
        Shipped: "bg-blue-100 text-blue-700 border border-blue-300",
        Processing: "bg-yellow-100 text-yellow-700 border border-yellow-300",
        Cancelled: "bg-red-100 text-red-700 border border-red-300",
        Pending: "bg-gray-100 text-gray-700 border border-gray-300",
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("https://myshop-72k8.onrender.com/getOrderAdmin", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(res.data.orders || []);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        const token = localStorage.getItem("token");
        const order = orders.find((o) => o._id === orderId);

        if (!order) return toast.error("Order not found.");
        if (["Delivered", "Cancelled"].includes(order.status)) {
            return toast.warning(`Cannot update a ${order.status.toLowerCase()} order.`);
        }
        if (order.status === newStatus) return;

        setUpdatingOrderId(orderId);
        try {
            const res = await axios.put(
                `https://myshop-72k8.onrender.com/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOrders((prev) =>
                prev.map((o) => (o._id === orderId ? { ...o, status: res.data.order.status } : o))
            );
            toast.success("Order status updated");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = filterStatus === "All" || order.status === filterStatus;
        const matchesSearch =
            order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const currentOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
            <ToastContainer />
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Orders</h1>

            <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="All">All Statuses</option>
                        {statusOptions.map((status) => (
                            <option key={status}>{status}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Search by Order ID or Name"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border rounded px-4 py-2 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin" />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <p className="text-center text-gray-500">No matching orders found.</p>
                ) : (
                    <div className="space-y-6">
                        {currentOrders.map((order) => (
                            <div key={order._id} className="border rounded-xl p-5 bg-gray-50 shadow-sm">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                                    <p className="text-sm text-gray-600">
                                        <strong>Order Date:</strong>{" "}
                                        {new Date(order.createdAt).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>

                                    <select
                                        className={`text-xs font-medium mt-2 md:mt-0 px-3 py-1 rounded-full cursor-pointer transition-all duration-200 ${statusColors[order.status] || "bg-gray-200 text-gray-800"
                                            }`}
                                        value={order.status}
                                        disabled={updatingOrderId === order._id || ["Delivered", "Cancelled"].includes(order.status)}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    >
                                        {statusOptions.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded shadow">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-14 h-14 object-cover rounded border"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    Qty: {item.qty} | ₹{item.price}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-700">
                                    <div>
                                        <p>
                                            <strong>Customer:</strong>{" "}
                                            {order.userId?.name || "N/A"} ({order.userId?.email || "N/A"})
                                        </p>
                                        <p>
                                            <strong>City:</strong> {order.shipping?.city || "N/A"} |{" "}
                                            <strong>Zip:</strong> {order.shipping?.zip || "N/A"}
                                        </p>
                                    </div>
                                    <div className="text-indigo-600 font-bold text-lg mt-2 sm:mt-0">
                                        ₹{order.totalAmount?.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="flex justify-center space-x-2 pt-6">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 border rounded text-sm ${currentPage === i + 1
                                            ? "bg-indigo-600 text-white border-indigo-600"
                                            : "text-indigo-600"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
