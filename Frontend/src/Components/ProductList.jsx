import React, { useState, useMemo } from "react";
import { ShoppingCart, Search } from "lucide-react";

const ITEMS_PER_PAGE = 8;

const ProductList = ({ products, onAddToCart, formatPrice }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-indigo-700 text-center">Our Products</h2>

            {/* Search Input */}
            <div className="flex items-center max-w-md mx-auto mb-6 bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2">
                <Search className="text-gray-500 mr-2" size={20} />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full outline-none text-gray-700"
                />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {paginatedProducts.length === 0 ? (
                    <p className="col-span-full text-center text-gray-600">No products found.</p>
                ) : (
                    paginatedProducts.map((product, index) => {
                        const key = product._id || product.id || `product-${index}`;
                        const hasDiscount = product?.discount > 0;
                        const isOutOfStock = product?.stock <= 0;
                        const mrp = product?.mrp || product.price;

                        return (
                            <div
                                key={key}
                                className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 p-6 flex flex-col items-center text-center"
                            >
                                {/* Discount badge */}
                                {hasDiscount && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow z-10">
                                        {product.discount}% OFF
                                    </div>
                                )}

                                <img
                                    loading="lazy"
                                    src={product.image || "https://via.placeholder.com/150"}
                                    alt={product.name || "Product Image"}
                                    className="w-36 h-36 object-cover rounded-xl mb-4 shadow"
                                />

                                <h3
                                    className="text-lg font-semibold text-gray-800 truncate w-full"
                                    title={product.name}
                                >
                                    {product.name}
                                </h3>

                                {/* Rating */}
                                {product.rating && (
                                    <p className="text-sm text-yellow-600 mt-1">
                                        ⭐ {product.rating}/5
                                    </p>
                                )}

                                {/* Price and MRP */}
                                <div className="mt-2 text-center">
                                    {hasDiscount ? (
                                        <>
                                            <p className="text-gray-400 line-through text-sm">
                                                MRP: {formatPrice(mrp)}
                                            </p>
                                            <p className="text-green-600 text-lg font-bold">
                                                {formatPrice(product.price)}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-green-600 text-lg font-bold">
                                            {formatPrice(product.price)}
                                        </p>
                                    )}
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => !isOutOfStock && onAddToCart(product)}
                                    disabled={isOutOfStock}
                                    className={`mt-6 w-full font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                                        ${isOutOfStock
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-purple-600 hover:to-indigo-500"
                                        }`}
                                    aria-label={`Add ${product.name} to cart`}
                                >
                                    <ShoppingCart size={20} />
                                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded-full border transition ${currentPage === i + 1
                                    ? "bg-indigo-600 text-white font-semibold shadow"
                                    : "bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
