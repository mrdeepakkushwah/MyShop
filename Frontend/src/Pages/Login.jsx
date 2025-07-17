import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "", role: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.role) {
            toast.error("Please select a role.");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                "https://myshop-72k8.onrender.com/login",
                formData,
                { withCredentials: true }
            );

            const { token, user } = res.data;

            if (token) localStorage.setItem("token", token);
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                if (user.role) localStorage.setItem("role", user.role);
            }

            toast.success("Login successful!");

            setTimeout(() => {
                navigate(user?.role === "admin" ? "/admin" : "/user/dashboard");
            }, 1000);
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed. Check your credentials or try again later.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4">
                <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl transition duration-300">
                    <h2 className="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-400 mb-6">
                        Welcome Back 👋
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Select Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition"
                            >
                                <option value="" disabled>Choose a role</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 text-white rounded-lg font-semibold text-lg transition ${loading
                                ? "bg-indigo-300 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Signup Link */}
                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
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
