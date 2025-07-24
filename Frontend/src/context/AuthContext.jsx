import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const defaultAuthContext = {
    user: null,
    token: null,
    login: () => { },
    logout: () => { },
    loading: true,
};

export const AuthContext = createContext(defaultAuthContext);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem("token");

            if (!storedToken) {
                setLoading(false);
                return;
            }

            setToken(storedToken);

            try {
                const res = await axios.get("https://myshop-72k8.onrender.com/me", {
                    headers: { Authorization: `Bearer ${storedToken}` },
                    withCredentials: true,
                });

                if (res.data?.user) {
                    setUser(res.data.user);
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                } else {
                    logout();
                }
            } catch (err) {
                const msg = err?.response?.data?.message || err.message;
                console.error("Auth revalidation failed:", msg);

                if (msg === "Token expired. Please login again.") {
                    toast.error("Session expired. Please log in again.");
                }

                logout();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = (userData, newToken) => {
        try {
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", newToken);
            setUser(userData);
            setToken(newToken);
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    const logout = () => {
        // If you don’t need a server request, remove this line:
        // await axios.get("https://myshop-72k8.onrender.com/logout");

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        toast.success("Logged out successfully.");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
