import React from "react";

const Unauthorized = () => {
    return (
        <div className="p-6 text-center text-red-600">
            <h1 className="text-2xl font-bold mb-2">403 - Unauthorized</h1>
            <p>You do not have permission to view this page.</p>
        </div>
    );
};

export default Unauthorized; // ✅ default export
