import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (countdown === 0) {
            navigate("/user/dashboard"); // 🔁 Redirect to user dashboard
            return;
        }
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="p-6 text-center text-red-600">
                <h1 className="text-2xl font-bold mb-2">403 - Unauthorized</h1>
                <p>You do not have permission to view this page.</p>
                <p className="mt-2 text-gray-600">
                    Redirecting in{" "}
                    <span className="font-semibold">{countdown}</span>{" "}
                    second{countdown !== 1 ? "s" : ""}...
                </p>
            </div>
        </div>
    );
};

export default Unauthorized;
