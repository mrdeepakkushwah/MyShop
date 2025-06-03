// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function ShoppingCart() {
//     const [cart, setCart] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Fetch cart data on mount
//     useEffect(() => {
//         const fetchCart = async () => {
//             try {
//                 const res = await axios.get("http://localhost:4000/cart");
//                 setCart(res.data);
//             } catch (error) {
//                 console.error("Failed to fetch cart", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchCart();
//     }, []);

//     // Update qty handler with backend update
//     const updateQty = async (id, qty) => {
//         if (qty < 1) return;
//         try {
//             await axios.put(`http://localhost:4000/cart/${id}`, { qty });
//             setCart((prev) =>
//                 prev.map((item) => (item.id === id ? { ...item, qty } : item))
//             );
//         } catch (error) {
//             console.error("Failed to update quantity", error);
//         }
//     };

//     // Remove item handler with backend delete
//     const removeItem = async (id) => {
//         try {
//             await axios.delete(`http://localhost:4000/cart/${id}`);
//             setCart((prev) => prev.filter((item) => item.id !== id));
//         } catch (error) {
//             console.error("Failed to remove item", error);
//         }
//     };

//     const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

//     if (loading) {
//         return <p className="text-center mt-10">Loading cart...</p>;
//     }

//     return (
//         <div className="max-w-5xl mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>

//             {cart.length === 0 ? (
//                 <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
//             ) : (
//                 <div className="space-y-6">
//                     {cart.map(({ id, name, price, qty, image }) => (
//                         <div
//                             key={id}
//                             className="flex flex-col sm:flex-row items-center sm:items-start justify-between border rounded-lg p-4 shadow-sm"
//                         >
//                             {/* Image */}
//                             <img
//                                 src={image}
//                                 alt={name}
//                                 className="w-24 h-24 rounded object-cover mb-4 sm:mb-0"
//                             />

//                             {/* Name and Price */}
//                             <div className="flex-1 sm:ml-6 text-center sm:text-left">
//                                 <h2 className="text-lg font-semibold">{name}</h2>
//                                 <p className="text-gray-700 mt-1">${price.toFixed(2)}</p>
//                             </div>

//                             {/* Quantity */}
//                             <div className="flex items-center space-x-2 mt-4 sm:mt-0">
//                                 <button
//                                     onClick={() => updateQty(id, qty - 1)}
//                                     className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
//                                     aria-label={`Decrease quantity of ${name}`}
//                                 >
//                                     −
//                                 </button>
//                                 <input
//                                     type="number"
//                                     min="1"
//                                     value={qty}
//                                     onChange={(e) =>
//                                         updateQty(id, parseInt(e.target.value) || 1)
//                                     }
//                                     className="w-12 text-center border rounded"
//                                     aria-label={`Quantity of ${name}`}
//                                 />
//                                 <button
//                                     onClick={() => updateQty(id, qty + 1)}
//                                     className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
//                                     aria-label={`Increase quantity of ${name}`}
//                                 >
//                                     +
//                                 </button>
//                             </div>

//                             {/* Remove button */}
//                             <button
//                                 onClick={() => removeItem(id)}
//                                 className="mt-4 sm:mt-0 sm:ml-6 text-red-600 hover:text-red-800 font-semibold"
//                                 aria-label={`Remove ${name} from cart`}
//                             >
//                                 Remove
//                             </button>
//                         </div>
//                     ))}

//                     {/* Total Price */}
//                     <div className="text-right text-xl font-bold border-t pt-4">
//                         Total: ${totalPrice.toFixed(2)}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
