import React from "react";
import { ShoppingCart } from "lucide-react"; // icon import from lucide-react

const ProductList = ({ products, onAddToCart, formatPrice }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 text-indigo-700 text-center">Our Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 max-w-7xl mx-auto">
                {products.map((product) => {
                    const key = product.id || product._id;
                    const hasDiscount = product?.discount > 0;
                    const mrp = product?.mrp || 0;

                    return (
                        <div
                            key={key}
                            className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 p-6 flex flex-col items-center text-center"
                        >
                            {/* Discount badge */}
                            {hasDiscount && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                                    {product.discount}% OFF
                                </div>
                            )}

                            <img
                                loading="lazy"
                                src={product.image || "https://via.placeholder.com/150"}
                                alt={product.name}
                                className="w-36 h-36 object-cover rounded-xl mb-4 shadow-md"
                            />

                            <h3
                                className="text-xl font-semibold text-gray-800 truncate w-full"
                                title={product.name}
                            >
                                {product.name}
                            </h3>

                            {/* Optional: Ratings (example) */}
                            {product.rating && (
                                <p className="text-sm text-yellow-600 mt-1">⭐ {product.rating}/5</p>
                            )}

                            {/* Price and MRP */}
                            <div className="flex flex-col items-center mt-2">
                                {hasDiscount ? (
                                    <>
                                        <p className="text-gray-400 line-through text-sm">
                                            MRP: ₹{mrp.toFixed(2)}
                                        </p>
                                        <p className="text-green-600 text-lg font-bold">
                                            Price: {formatPrice(product.price)}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-green-600 text-lg font-bold mt-1">
                                        Price: {formatPrice(product.price)}
                                    </p>
                                )}
                            </div>

                            {/* Add to Cart Button with Icon */}
                            <button
                                onClick={() => onAddToCart(product)}
                                aria-label={`Add ${product.name} to cart`}
                                className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3 rounded-xl hover:from-purple-600 hover:to-indigo-500 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductList;
