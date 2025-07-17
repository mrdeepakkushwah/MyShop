import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        _id: "",
        name: "",
        email: "",
        password: "",
        contact: "",
        city: "",
        pincode: "",
        dob: "",
        gender: "",
    });

    const [originalUser, setOriginalUser] = useState({});
    const [editingFields, setEditingFields] = useState({});
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [hasEdits, setHasEdits] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser({ ...storedUser, password: "" });
            setOriginalUser({ ...storedUser, password: "" });
        }
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasEdits) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasEdits]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
        setHasEdits(true);
    };

    const handleDoubleClick = (field) => {
        if (field === "email" || field === "contact") return;
        setEditingFields((prev) => ({ ...prev, [field]: true }));
    };

    const handleResetField = (field) => {
        setUser((prev) => ({ ...prev, [field]: originalUser[field] }));
        setEditingFields((prev) => ({ ...prev, [field]: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const { _id, ...userToSend } = user;

            if (!userToSend.password) {
                delete userToSend.password;
            }

            const { data } = await axios.put(
                "https://myshop-72k8.onrender.com/update-profile",
                userToSend,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Profile updated successfully! Redirecting...");
            setIsRedirecting(true);
            setEditingFields({});
            setHasEdits(false);

            setTimeout(() => {
                navigate("/user/dashboard");
            }, 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const renderInput = (label, name, type = "text") => {
        const isDisabled = name === "email" || name === "contact";
        return (
            <div
                onDoubleClick={() => handleDoubleClick(name)}
                className={`relative group ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                title={isDisabled ? "This field is not editable" : "Double-click to edit"}
            >
                <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
                {editingFields[name] ? (
                    <div className="flex items-center gap-2">
                        <input
                            type={type}
                            name={name}
                            value={user[name] || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={() => handleResetField(name)}
                            className="text-sm text-red-500 hover:underline"
                            title="Reset this field to original value"
                        >
                            🔄
                        </button>
                    </div>
                ) : (
                    <p className={`p-2 bg-gray-100 rounded ${isDisabled ? "text-gray-500" : ""}`}>
                        {user[name] || "-"}
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow rounded-lg relative">
            <ToastContainer />
            {isRedirecting && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-lg">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600 border-solid mb-4"></div>
                    <p className="text-indigo-600 font-semibold">Redirecting to dashboard...</p>
                </div>
            )}

            <h2 className="text-2xl font-bold text-indigo-600 mb-6">User Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {renderInput("Name", "name")}
                {renderInput("Email", "email", "email")}
                {renderInput("Contact", "contact")}
                {renderInput("City", "city")}
                {renderInput("Pincode", "pincode")}
                {renderInput("Date of Birth", "dob", "date")}
                {renderInput("Gender", "gender")}

                {editingFields["password"] ? (
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Leave blank to keep current password"
                            />
                            <button
                                type="button"
                                onClick={() => handleResetField("password")}
                                className="text-sm text-red-500 hover:underline"
                                title="Reset this field to original value"
                            >
                                🔄
                            </button>
                        </div>
                    </div>
                ) : (
                    <div onDoubleClick={() => handleDoubleClick("password")}>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <p className="p-2 bg-gray-100 rounded">••••••••</p>
                    </div>
                )}

                {hasEdits && (
                    <button
                        type="submit"
                        disabled={isRedirecting}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        Save Changes
                    </button>
                )}
            </form>
        </div>
    );
};

export default UserProfile;
