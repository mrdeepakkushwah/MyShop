import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = ()=> {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (countdown === 0) {
            navigate("/user/dashboard"); // Redirect to user dashboard after countdown
            return;
        }
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, navigate]);

    return (
        <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
                Order Placed Successfully!
            </h2>
            <p>Thank you for shopping with us.</p>
            <p className="mt-2 text-gray-600">
                Redirecting in <span className="font-semibold">{countdown}</span>{" "}
                second{countdown !== 1 ? "s" : ""}...
            </p>
        </div>
    );
}
export default OrderSuccess;
