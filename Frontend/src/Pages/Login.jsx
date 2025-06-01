import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:4000/login", formData);

            const { token, user } = res.data;

            if (token) localStorage.setItem("token", token);
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                if (user.role) {
                    localStorage.setItem("role", user.role); // Save role for access control
                }
            }

            toast.success("Login successful!");

            // Role based redirect
            setTimeout(() => {
                if (user.role === "admin") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/user/dashboard");
                }
            }, 1000);
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed. Try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 text-white rounded-md font-semibold transition ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
