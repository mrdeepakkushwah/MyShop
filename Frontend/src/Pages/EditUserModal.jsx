import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditUserModal = ({ user, onClose, onSuccess }) => {
    const [name, setName] = useState(user.name);
    const [role, setRole] = useState(user.role);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.patch(
                `https://myshop-72k8.onrender.com/admin/update-user/${user._id}`,
                { name, role },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                toast.success("User updated successfully");
                onSuccess();
            }
        } catch (err) {
            console.error("Error details:", err.response?.data || err.message);
            toast.error(err?.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md p-6 rounded-xl shadow-lg relative">
                <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
                    ✏️ Edit User
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-gray-700 dark:text-gray-200">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-gray-700 dark:text-gray-200">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                            disabled={loading}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
