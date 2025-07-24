import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { debounce } from "lodash";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const limit = 10;

    // Fetch Users
    const fetchUsers = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Unauthorized. Please login.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`https://myshop-72k8.onrender.com/admin/users`, {
                params: { search, page, limit },
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(res.data);
            console.log(users);
            if (res.status === 200) {
                setUsers(res.data.users || []);
                setTotalPages(res.data.totalPages || 1);
                setError("");
            }
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchUsers = debounce(fetchUsers, 400);

    useEffect(() => {
        debouncedFetchUsers();
        return () => debouncedFetchUsers.cancel();
    }, [search, page]);

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://myshop-72k8.onrender.com/delete-user`, {
                data: { userId },
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("User deleted successfully");
            fetchUsers(); // Refresh list
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to delete user");
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-indigo-600">Manage Users</h1>

            {/* Search */}
            <div className="relative mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // Reset to page 1 on search
                    }}
                    placeholder="Search users by name or email..."
                    className="w-full p-2 pr-10 border rounded dark:bg-gray-800 dark:text-white"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Loader / Error / Table */}
            {loading ? (
                <p className="text-center text-indigo-600 animate-pulse">Loading users...</p>
            ) : error ? (
                <p className="text-center text-red-600">{error}</p>
            ) : users.length === 0 ? (
                <p className="text-center text-gray-500">No users found.</p>
            ) : (
                <>
                    <table className="w-full border border-gray-300 dark:border-gray-600 text-left">
                        <thead className="bg-indigo-100 dark:bg-indigo-800">
                            <tr>
                                <th className="p-3">#</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id} className="border-t dark:border-gray-700">
                                    <td className="p-3">{(page - 1) * limit + index + 1}</td>
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3 capitalize">{user.role}</td>
                                    <td className="p-3">
                                        <button
                                            className="text-blue-600 hover:underline mr-2"
                                            onClick={() => console.log("Edit user", user._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-center items-center gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="text-indigo-700 dark:text-indigo-300">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminUsers;
