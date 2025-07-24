import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import LabeledInput from './LabeledInput';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState({ name: '', price: '', mrp: '', discount: '', stock: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('https://myshop-72k8.onrender.com/products');
                setProducts(Array.isArray(res.data.products) ? res.data.products : []);
            } catch (error) {
                console.error('Failed to fetch products', error);
                toast.error('Failed to fetch products');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`https://myshop-72k8.onrender.com/products/${id}`);
            setProducts(prev => prev.filter(p => p._id !== id));
            toast.success("Product deleted successfully!");
        } catch (error) {
            console.error('Delete failed', error.response || error.message || error);
            toast.error("Failed to delete product.");
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setForm({
            name: String(product.name || ''),
            price: String(product.price || ''),
            mrp: String(product.mrp || ''),
            discount: String(product.discount || ''),
            stock: String(product.stock || ''),
        });
        setErrors({});
    };

    const closeModal = () => {
        setEditingProduct(null);
        setForm({ name: '', price: '', mrp: '', discount: '', stock: '' });
        setErrors({});
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (isNaN(form.price) || form.price <= 0) newErrors.price = 'Price must be positive';
        if (isNaN(form.mrp) || form.mrp <= 0) newErrors.mrp = 'MRP must be positive';
        if (form.discount === '' || form.discount < 0 || form.discount > 100) newErrors.discount = '0-100 only';
        if (isNaN(form.stock) || form.stock < 0) newErrors.stock = 'Stock cannot be negative';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async () => {
        if (!validate()) return;

        setUpdating(true);
        try {
            const updatedProduct = {
                ...form,
                price: Number(form.price),
                mrp: Number(form.mrp),
                discount: Number(form.discount),
                stock: Number(form.stock),
            };

            await axios.put(`https://myshop-72k8.onrender.com/products/${editingProduct._id}`, updatedProduct);
            setProducts(prev =>
                prev.map(p => (p._id === editingProduct._id ? { ...p, ...updatedProduct } : p))
            );
            toast.success("Product updated successfully!");
            closeModal();
        } catch (error) {
            console.error('Update failed', error.response || error.message || error);
            toast.error("Failed to update product.");
        } finally {
            setUpdating(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <Toaster position="top-right" reverseOrder={false} />
            <h1 className="text-4xl font-extrabold text-indigo-700 text-center mb-12">Admin Panel - Product Management</h1>

            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full max-w-lg border border-indigo-300 px-5 py-3 rounded-xl shadow-sm placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <p className="text-center mt-16 text-gray-500 text-lg">Loading products...</p>
            ) : filteredProducts.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col"
                        >
                            <img
                                src={product.image || '/placeholder.jpg'}
                                alt={product.name}
                                className="h-48 w-full object-cover rounded-2xl mb-5 shadow"
                            />
                            <h2 className="text-xl font-semibold text-gray-800 truncate mb-2">{product.name}</h2>
                            <p className="text-sm text-gray-500 mb-1">
                                Listed: {product.listedDate ? new Date(product.listedDate).toLocaleDateString() : 'N/A'}
                            </p>
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-base font-semibold text-green-700">₹{product.price}</p>
                                <p className="text-sm text-gray-400 line-through">₹{product.mrp}</p>
                            </div>
                            <p className="text-sm text-indigo-600 font-medium mb-1">Discount: {product.discount}%</p>
                            <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </p>

                            <div className="flex justify-between mt-auto pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => openEditModal(product)}
                                    className="text-indigo-600 font-semibold hover:text-indigo-800 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="text-red-600 font-semibold hover:text-red-800 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Edit Product</h2>
                        <div className="space-y-5">
                            <LabeledInput
                                label="Product Name"
                                name="name"
                                value={form.name}
                                onChange={handleFormChange}
                                placeholder="Enter product name"
                            />
                            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}

                            <LabeledInput
                                label="Price (₹)"
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleFormChange}
                                placeholder="Enter price"
                            />
                            {errors.price && <p className="text-xs text-red-600">{errors.price}</p>}

                            <LabeledInput
                                label="MRP (₹)"
                                name="mrp"
                                type="number"
                                value={form.mrp}
                                onChange={handleFormChange}
                                placeholder="Enter MRP"
                            />
                            {errors.mrp && <p className="text-xs text-red-600">{errors.mrp}</p>}

                            <LabeledInput
                                label="Discount (%)"
                                name="discount"
                                type="number"
                                value={form.discount}
                                onChange={handleFormChange}
                                placeholder="0 - 100"
                            />
                            {errors.discount && <p className="text-xs text-red-600">{errors.discount}</p>}

                            <LabeledInput
                                label="Stock"
                                name="stock"
                                type="number"
                                value={form.stock}
                                onChange={handleFormChange}
                                placeholder="Available stock quantity"
                            />
                            {errors.stock && <p className="text-xs text-red-600">{errors.stock}</p>}
                        </div>

                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={closeModal}
                                className="bg-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                            >
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
