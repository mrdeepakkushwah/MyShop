import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Mail, Lock } from 'lucide-react';

const ForgetPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const validatePassword = (password) => {
        // Min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, confirmPassword } = formData;

        if (!email || !password || !confirmPassword) {
            toast.error('All fields are required.');
            return;
        }

        if (!validatePassword(password)) {
            toast.error(
                'Password must be at least 6 characters, with uppercase, lowercase, number, and special character.'
            );
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post('https://myshop-72k8.onrender.com/forget-password', {
                email,
                password,
            });
                if(res.status === 200){
                    toast.success(res.data.message || 'Password updated successfully.', {
                        position: "top-right",
                        autoClose: 1500,
                      });
                    setFormData({ email: '', password: '', confirmPassword: '' });
                    navigate('/login')
                }
        } catch (err) {
            toast.error(
                err.response?.data?.message || 'Failed to reset password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    Reset Your Password
                </h2>
                <ToastContainer/>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="New password"
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
                    >
                        {loading ? 'Updating...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;
