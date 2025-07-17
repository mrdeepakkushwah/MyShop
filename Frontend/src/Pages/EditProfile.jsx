// src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        city: "",
        pincode: "",
        dob: "",
        gender: "",
        password: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("https://myshop-72k8.onrender.com/user/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const user = res.data.user;
                setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    contact: user.contact || "",
                    city: user.city || "",
                    pincode: user.pincode || "",
                    dob: user.dob ? user.dob.slice(0, 10) : "",
                    gender: user.gender || "",
                    password: "",
                });
            } catch (err) {
                toast.error("Failed to load user details.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (formData.contact.length !== 10 || isNaN(formData.contact)) {
            return toast.error("Contact must be a 10-digit number.");
        }

        if (formData.email.trim() === "") {
            return toast.error("Email is required.");
        }

        try {
            const res = await axios.put("http://localhost:4000/api/user/update-profile", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("Profile updated successfully!");
            localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Error updating profile"
            );
        }
    };

    if (loading) {
        return <div className="text-center mt-10 text-lg text-gray-600">Loading profile...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Contact</label>
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Pincode</label>
                    <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded-md"
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Leave blank to keep current password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                    >
                        Update Profile
                    </button>
                </div>
            </form>

            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default EditProfile;
