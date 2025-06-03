// src/pages/UserProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        contact: "",
        city: "",
        pincode: "",
        dob: "",
        gender: "",
    });

    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser({ ...storedUser, password: "" });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.put("http://localhost:4000/update-profile", user, {
                headers: { Authorization: `Bearer ${token}` },
            });
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Profile updated successfully!");
            setEditMode(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const renderInput = (label, name, type = "text") => (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
            {editMode ? (
                <input
                    type={type}
                    name={name}
                    value={user[name] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            ) : (
                <p className="p-2 bg-gray-100 rounded">{user[name] || "-"}</p>
            )}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-600">User Profile</h2>
                <button
                    onClick={() => setEditMode(!editMode)}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                    {editMode ? "Cancel" : "Edit"}
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {renderInput("Name", "name")}
                {renderInput("Email", "email", "email")}
                {renderInput("Contact", "contact")}
                {renderInput("City", "city")}
                {renderInput("Pincode", "pincode")}
                {renderInput("Date of Birth", "dob", "date")}
                {editMode ? (
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Gender</label>
                        <select
                            name="gender"
                            value={user.gender || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                ) : (
                    renderInput("Gender", "gender")
                )}

                {editMode && (
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Leave blank to keep current password"
                        />
                    </div>
                )}

                {editMode && (
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                    >
                        Save Changes
                    </button>
                )}
            </form>
        </div>
    );
};

export default UserProfile;
