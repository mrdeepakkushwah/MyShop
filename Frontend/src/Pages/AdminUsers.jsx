import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import EditUserModal from "./EditUserModal";
import io from "socket.io-client";

const socket = io("https://myshop-72k8.onrender.com"); // ✅ WebSocket server

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [editUser, setEditUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://myshop-72k8.onrender.com/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.users);
        } catch (err) {
            toast.error("Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchUsers();

        socket.on("userUpdated", (updatedUser) => {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === updatedUser._id ? updatedUser : user
                )
            );
        });

        socket.on("userDeleted", (deletedUserId) => {
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user._id !== deletedUserId)
            );
        });

        return () => {
            socket.off("userUpdated");
            socket.off("userDeleted");
        };
    }, []);

    useEffect(() => {
        let filtered = [...users];

        if (search) {
            filtered = filtered.filter(
                (user) =>
                    user.name.toLowerCase().includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (roleFilter) {
            filtered = filtered.filter((user) => user.role === roleFilter);
        }

        if (sortField) {
            filtered.sort((a, b) => {
                const valA = a[sortField]?.toLowerCase?.() || "";
                const valB = b[sortField]?.toLowerCase?.() || "";
                if (sortOrder === "asc") return valA.localeCompare(valB);
                return valB.localeCompare(valA);
            });
        }

        setFilteredUsers(filtered);
    }, [users, search, roleFilter, sortField, sortOrder]);

    const deleteUser = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://myshop-72k8.onrender.com/admin/delete-user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("User deleted successfully");
        } catch (err) {
            toast.error("Failed to delete user");
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-indigo-700">👥 Admin Users</h1>

            <div className="flex gap-4 mb-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-4 py-2 rounded w-full md:w-auto"
                />

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border px-4 py-2 rounded"
                >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="border px-4 py-2 rounded"
                >
                    <option value="">Sort By</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border px-4 py-2 rounded"
                >
                    <option value="asc">⬆️ Ascending</option>
                    <option value="desc">⬇️ Descending</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white white:bg-gray-800 rounded-lg shadow">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4">Email</th>
                            <th className="py-2 px-4">Role</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="border-t border-gray-200 gray:border-gray-700">
                                <td className="py-2 px-4">{user.name}</td>
                                <td className="py-2 px-4">{user.email}</td>
                                <td className="py-2 px-4 capitalize">{user.role}</td>
                                <td className="py-2 px-4 flex gap-2">
                                    <button
                                        onClick={() => setEditUser(user)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-4">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editUser && (
                <EditUserModal
                    user={editUser}
                    onClose={() => setEditUser(null)}
                    onSuccess={() => setEditUser(null)} // socket will auto-refresh list
                />
            )}
        </div>
    );
};

export default AdminUsers;
