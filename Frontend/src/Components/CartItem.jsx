import React from "react";

const CartItem = ({ item, updateQty, removeItem, formatPrice }) => (
    <div className="flex mb-6 space-x-4">
        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded shadow" />
        <div className="flex-grow">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-indigo-600">{formatPrice(item.price)}</p>
            <div className="flex mt-1 space-x-2">
                <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2 py-1 bg-gray-200 rounded">−</button>
                <input type="number" min="1" value={item.qty} onChange={(e) => updateQty(item.id, parseInt(e.target.value))} className="w-12 text-center border rounded" />
                <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
            </div>
        </div>
        <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800">✕</button>
    </div>
);

export default CartItem;
