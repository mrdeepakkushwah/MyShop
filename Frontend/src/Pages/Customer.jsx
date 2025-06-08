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

        const response = await axios.get("http://localhost:4000/getOrderAdmin", config);
        console.log(response.data.orders);
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error(err);
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

  const handleRazorpay = (order) => {
    console.log("Initiate Razorpay for order:", order._id);
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
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
        All Customer
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {!filteredOrders.length ? (
          <p className="text-gray-500 italic text-center">No matching orders found.</p>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
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
                </div>

                {/* ✅ Show customer info from userId */}
                <div className="mb-3 text-sm text-gray-700">
                  <strong>Name: </strong> {order.userId?.name || "N/A"} <br />
                  <strong>Email: </strong> {order.userId?.email || "N/A"} <br />
                  <strong>City: </strong> {order.userId?.city || "N/A"} <br />
                  <strong>Pincode: </strong> {order.userId?.pincode || "N/A"}
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
