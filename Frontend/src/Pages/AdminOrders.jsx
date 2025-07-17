import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const ordersPerPage = 6;

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get("https://myshop-72k8.onrender.com/getOrderAdmin", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data.orders || []);
            } catch (err) {
                toast.error("Failed to load orders");
                setError("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    const statusColors = {
        Delivered: "bg-green-100 text-green-700 border border-green-300",
        Shipped: "bg-blue-100 text-blue-700 border border-blue-300",
        Processing: "bg-yellow-100 text-yellow-700 border border-yellow-300",
        Cancelled: "bg-red-100 text-red-700 border border-red-300",
        Pending: "bg-gray-100 text-gray-700 border border-gray-300",
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const token = localStorage.getItem("token");
        const order = orders.find((o) => o._id === orderId);

        if (!order) {
            toast.error("Order not found.");
            return;
        }

        if (order.status === "Delivered" || order.status === "Cancelled") {
            toast.warn(`Cannot update a ${order.status.toLowerCase()} order.`);
            return;
        }

        if (order.status === newStatus) return;

        setUpdatingOrderId(orderId);

        try {
            await axios.put(
                `http://localhost:4000/orders/${orderId}/status`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );

            toast.success("Order status updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update order status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = filterStatus === "All" || order.status === filterStatus;
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const currentOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
            <ToastContainer />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
                Orders
            </h1>

            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <select
                            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="All">All Statuses</option>
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer Name"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-72"
                        />
                    </div>
                </div>

                {!filteredOrders.length ? (
                    <p className="text-gray-500 italic text-center">No matching orders found.</p>
                ) : (
                    <>
                        <div className="grid gap-6">
                            {currentOrders.map((order) => {
                                const user = order.userId;
                                return (
                                    <div
                                        key={order._id}
                                        className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Order Date:</span>{" "}
                                                {new Date(order.createdAt).toLocaleString("en-IN", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>

                                            <select
                                                value={order.status || "Pending"}
                                                onChange={(e) =>
                                                    handleStatusChange(order._id, e.target.value)
                                                }
                                                disabled={
                                                    updatingOrderId === order._id ||
                                                    ["Delivered", "Cancelled"].includes(order.status)
                                                }
                                                className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${statusColors[order.status] || "bg-gray-200 text-gray-700"
                                                    }`}
                                            >
                                                {statusOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                            {order.items?.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3 border rounded-md bg-gray-50 p-2"
                                                >
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-14 h-14 object-cover rounded border"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            Qty: {item.qty} | ₹{item.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-700">
                                            <div className="mb-3 sm:mb-0">
                                                <p>
                                                    <span className="font-semibold">Customer:</span>{" "}
                                                    {user?.name} ({user?.email})
                                                </p>
                                                <p>
                                                    <span className="font-semibold">City:</span>{" "}
                                                    {user?.city},{" "}
                                                    <span className="font-semibold">Pincode:</span>{" "}
                                                    {user?.pincode}
                                                </p>
                                            </div>
                                            <div className="text-lg font-bold text-indigo-600">
                                                ₹{order.totalAmount?.toFixed(2)}
                                            </div>
                                        </div>

                                        {order.status === "Pending" && (
                                            <div className="text-right mt-4">
                                                <button
                                                    onClick={() =>
                                                        alert("Implement Razorpay integration here")
                                                    }
                                                    className="inline-block px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg shadow hover:bg-indigo-700 transition"
                                                >
                                                    Pay Now
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-center items-center space-x-3 mt-8">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded border ${currentPage === 1
                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "text-indigo-600 border-indigo-600 hover:bg-indigo-100"
                                    }`}
                            >
                                Prev
                            </button>

                            {[...Array(totalPages)].map((_, idx) => {
                                const page = idx + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`px-3 py-1 rounded border ${page === currentPage
                                            ? "bg-indigo-600 text-white border-indigo-600"
                                            : "text-indigo-600 border-indigo-600 hover:bg-indigo-100"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded border ${currentPage === totalPages
                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "text-indigo-600 border-indigo-600 hover:bg-indigo-100"
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
