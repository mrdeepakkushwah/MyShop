import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { FaTrashAlt } from "react-icons/fa";

const Cart = ({
    cart,
    updateQty,
    removeItem,
    formatPrice,
    totalPrice, // you may not need this prop since you calculate total locally below
}) => {
    const navigate = useNavigate();

    // Calculate total price here so it's always accurate and consistent
    const calculatedTotalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handleCheckout = () => {
        // Navigate to checkout page with cart and totalPrice as state
        navigate("/checkout", { state: { cart, totalPrice: calculatedTotalPrice } });
    };

    const [removingIds, setRemovingIds] = useState([]);
    const [qtyChangedId, setQtyChangedId] = useState(null);
    const qtyTimers = useRef({});

    const handleQtyChange = (itemId, val) => {
        if (qtyTimers.current[itemId]) {
            clearTimeout(qtyTimers.current[itemId]);
        }
        qtyTimers.current[itemId] = setTimeout(() => {
            updateQty(itemId, val);
            setQtyChangedId(itemId);
            setTimeout(() => setQtyChangedId(null), 500);
        }, 300);
    };

    const onRemove = (itemId) => {
        setRemovingIds((ids) => [...ids, itemId]);
        setTimeout(() => {
            removeItem(itemId);
            setRemovingIds((ids) => ids.filter((id) => id !== itemId));
        }, 300);
    };

    return (
        <div className="flex flex-col h-full max-h-[80vh] min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
            {cart.length === 0 ? (
                <p className="text-center text-gray-500 mt-20">Your cart is empty.</p>
            ) : (
                <>
                    <ul className="flex-1 overflow-y-auto scroll-smooth space-y-4 mb-4 px-1 sm:px-3">
                        {cart.map((item) => {
                            const itemId = item.id || item._id;
                            const isRemoving = removingIds.includes(itemId);
                            const isQtyChanged = qtyChangedId === itemId;

                            return (
                                <li
                                    key={itemId}
                                    className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 border-b pb-3
                                        transform transition-all duration-300 ease-in-out
                                        ${isRemoving ? "opacity-0 -translate-x-10 h-0 p-0 overflow-hidden" : "opacity-100"}
                                        ${isQtyChanged ? "bg-yellow-100" : ""}
                                    `}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full max-w-[150px] h-28 object-cover rounded-md mx-auto sm:mx-0"
                                    />
                                    <div className="flex-1 w-full">
                                        <h4 className="font-semibold text-gray-800 text-center sm:text-left">
                                            {item.name}
                                        </h4>
                                        <p className="text-indigo-600 font-bold text-center sm:text-left">
                                            {formatPrice(item.price)}
                                        </p>

                                        <div className="flex justify-center sm:justify-start items-center mt-2 space-x-2">
                                            <label htmlFor={`qty-${itemId}`} className="text-sm">
                                                Qty:
                                            </label>
                                            <input
                                                type="number"
                                                id={`qty-${itemId}`}
                                                min="1"
                                                defaultValue={item.qty}
                                                onChange={(e) => {
                                                    const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                                                    handleQtyChange(itemId, val);
                                                }}
                                                className="w-16 border rounded px-2 py-1 text-center"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onRemove(itemId)}
                                        className="text-red-600 hover:text-red-800 mt-3 sm:mt-0"
                                        title="Remove Item"
                                        aria-label={`Remove ${item.name} from cart`}
                                    >
                                        <FaTrashAlt size={20} />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="border-t pt-4 px-2 sm:px-3">
                        <p className="text-lg font-bold text-gray-900 mb-4 text-center sm:text-right">
                            Total: {formatPrice(calculatedTotalPrice)}
                        </p>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
