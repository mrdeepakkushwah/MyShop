import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = ({ cart, updateQty, removeItem, formatPrice }) => {
    const navigate = useNavigate();

    // Calculate total price on the fly from current cart state
    const calculatedTotalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    // States for removal animation and quantity update loading
    const [removingIds, setRemovingIds] = useState([]);
    const [qtyChangedId, setQtyChangedId] = useState(null);
    const [qtyLoadingId, setQtyLoadingId] = useState(null);

    // Ref to store timers for debounce per item
    const qtyTimers = useRef({});

    // Debounced quantity change handler
    const handleQtyChange = (itemId, newQty) => {
        if (newQty < 1) return;

        // Clear any existing timer for this item
        if (qtyTimers.current[itemId]) {
            clearTimeout(qtyTimers.current[itemId]);
        }

        // Set loading state for this input
        setQtyLoadingId(itemId);

        // Start debounce timer (300ms)
        qtyTimers.current[itemId] = setTimeout(async () => {
            // Find the item from cart
            const itemIndex = cart.findIndex((i) => i._id === itemId || i.id === itemId);
            if (itemIndex === -1) {
                setQtyLoadingId(null);
                return;
            }
            const item = cart[itemIndex];

            try {
                // Fetch current stock from backend
                const { data } = await axios.get(`https://myshop-72k8.onrender.com/products/getProductById/${itemId}`);
                console.log(data)
                const currentStock = data.product.stock;

                if (newQty > currentStock) {
                    toast.warning("Quantity exceeds available stock.");
                    setQtyLoadingId(null);
                    return;
                }

                // Calculate difference in qty
                const qtyDiff = newQty - item.qty;
                if (qtyDiff === 0) {
                    setQtyLoadingId(null);
                    return;
                }

                // Update backend stock
                await axios.put(`http://localhost:4000/products/${itemId}/update-stock`, {
                    qtyChange: qtyDiff,
                });

                // Update qty in parent state (also pass updated stock if needed)
                updateQty(itemId, newQty, currentStock);

                // Show brief highlight for qty change
                setQtyChangedId(itemId);
                setTimeout(() => setQtyChangedId(null), 500);
            } catch (err) {
                console.error(err);
                toast.error("Failed to update quantity.");
            } finally {
                setQtyLoadingId(null);
            }
        }, 300);
    };

    // Remove item with animation
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
                            const isQtyLoading = qtyLoadingId === itemId;

                            return (
                                <li
                                    key={itemId}
                                    className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 border-b pb-3
                    transform transition-all duration-300 ease-in-out
                    ${isRemoving
                                            ? "opacity-0 -translate-x-10 h-0 p-0 overflow-hidden"
                                            : "opacity-100"
                                        }
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
                                                value={item.qty}
                                                disabled={isQtyLoading}
                                                onChange={(e) => {
                                                    const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                                                    handleQtyChange(itemId, val);
                                                }}
                                                className={`w-16 border rounded px-2 py-1 text-center ${isQtyLoading ? "opacity-60 cursor-not-allowed" : ""
                                                    }`}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 text-center sm:text-left">
                                            In stock: {item.stock}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onRemove(itemId)}
                                        className="text-red-600 hover:text-red-800 mt-3 sm:mt-0"
                                        title="Remove Item"
                                        aria-label={`Remove ${item.name} from cart`}
                                        disabled={isQtyLoading}
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
                            onClick={() =>
                                navigate("/checkout", {
                                    state: { cart, totalPrice: calculatedTotalPrice },
                                })
                            }
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
