import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user', // default role
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Basic validation
    const validate = () => {
        const errs = {};
        if (!formData.name.trim()) errs.name = 'Name is required';
        if (!formData.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Email is invalid';
        if (!formData.password) errs.password = 'Password is required';
        else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
        if (!formData.role) errs.role = 'Role is required';
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:4000/auth/register', formData);
            toast.success('Registration successful!');
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'user',
            });
        } catch (error) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg">
            <ToastContainer />
            <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block font-medium mb-1">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-indigo-300'
                            }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block font-medium mb-1">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-indigo-300'
                            }`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block font-medium mb-1">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-indigo-300'
                            }`}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Role Dropdown */}
                <div>
                    <label htmlFor="role" className="block font-medium mb-1">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 ${errors.role ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-indigo-300'
                            }`}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-semibold py-3 rounded hover:bg-indigo-700 transition disabled:opacity-60"
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
