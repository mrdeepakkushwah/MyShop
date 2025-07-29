import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
    loginStart,
    loginSuccess,
    loginFailure,
} from '../redux/authSlice';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());

        try {
            const res = await axios.post(
                "https://myshop-72k8.onrender.com/login",
                formData,
                { withCredentials: true }
            );
            const { token, user } = res.data;

            if (user && token) {
                dispatch(loginSuccess({ user, token }));
                toast.success("Login successful!");
                navigate(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
            } else {
                throw new Error("Invalid login response");
            }
        } catch (err) {
            dispatch(loginFailure());
            toast.error(
                err.response?.data?.message || "Login failed. Please try again."
            );
        }
    };

    useEffect(() => {
        if (user) {
            const redirectPath = user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
            navigate(redirectPath);
        }
    }, [user, navigate]);

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4">
                <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl transition duration-300">
                    <h2 className="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-400 mb-6">
                        Welcome Back 👋
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition"
                            />
                        </div>

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
                                placeholder="••••••••"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 dark:text-white transition"
                            />
                        </div>

                        <div className="text-right text-sm mt-1">
                            <Link to="/forget-password" className="text-indigo-600 hover:underline dark:text-indigo-400">
                                Forgot Password?
                            </Link>
                        </div>

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
