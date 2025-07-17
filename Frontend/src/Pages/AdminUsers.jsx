import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const limit = 10;

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://myshop-72k8.onrender.com/users`, {
                params: { search, page, limit },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setUsers(res.data.users || []);
            setTotalPages(res.data.totalPages || 1);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, page]);

    const handleDelete = (id) => {
        // Placeholder logic
        console.log("Delete user", id);
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-indigo-600">Manage Users</h1>

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full p-2 mb-4 border rounded dark:bg-gray-800 dark:text-white"
            />

            {loading ? (
                <p className="text-center text-gray-500 dark:text-gray-300">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-600">{error}</p>
            ) : users.length === 0 ? (
                <p className="text-center text-gray-500">No users found.</p>
            ) : (
                <>
                    <table className="w-full border border-gray-300 dark:border-gray-600 text-left">
                        <thead className="bg-indigo-100 dark:bg-indigo-800">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-t dark:border-gray-700">
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
