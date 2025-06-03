import React from "react";

const ProductCard = ({ product, onAddToCart, formatPrice }) => {
    const hasDiscount = product.discount > 0;
    const isNew = product.isNew; // Assume product.isNew is a boolean flag passed in

    return (
        <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 p-5 flex flex-col items-center text-center w-full max-w-sm mx-auto">

            {/* Discount Badge */}
            {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {product.discount}% OFF
                </div>
            )}

            {/* New Badge */}
            {isNew && (
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    NEW
                </div>
            )}

            <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-xl mb-4 shadow-md"
            />
            <h3 className="text-xl font-semibold text-gray-800 truncate w-full">
                {product.name}
            </h3>

            {/* Show original MRP with strike-through if discount */}
            {hasDiscount ? (
                <div className="flex flex-col items-center mt-2">
                    <p className="text-gray-400 line-through text-sm">
                        ₹{product.mrp.toFixed(2)}
                    </p>
                    <p className="text-green-600 text-lg font-bold">
                        {formatPrice(product.price)}
                    </p>
                </div>
            ) : (
                <p className="text-green-600 text-lg font-bold mt-2">
                    {formatPrice(product.price)}
                </p>
            )}

            <button
                onClick={() => onAddToCart(product)}
                className="mt-5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-2 rounded-xl hover:from-purple-600 hover:to-indigo-500 transition-all duration-300"
            >
                🛒 Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;
