import React, { useEffect, useState } from "react";
import axios from "axios";

const Customer = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const response = await axios.get(
          "https://myshop-72k8.onrender.com/getOrderAdmin",
          config
        );
        setOrders(response.data.orders || []);
      } catch (err) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(searchLower) ||
      (order.userId?.name && order.userId.name.toLowerCase().includes(searchLower)) ||
      (order.userId?.email && order.userId.email.toLowerCase().includes(searchLower));
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-10 max-w-7xl mx-auto bg-gradient-to-b from-white via-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
        All Customers
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-4">
        {!filteredOrders.length ? (
          <p className="text-gray-500 italic text-center">No matching orders found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col gap-2 mb-3 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">Order Id:</span> {order._id}
                  </div>
                  <div>
                    <span className="font-semibold">Order Date:</span>{" "}
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <div>
                    <span className="font-semibold">Name:</span>{" "}
                    {order.userId?.name || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span>{" "}
                    {order.userId?.email || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">City:</span>{" "}
                    {order.userId?.city || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Pincode:</span>{" "}
                    {order.userId?.pincode || "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Customer;
