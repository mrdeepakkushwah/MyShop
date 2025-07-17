import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProductPage = () => {
    const [product, setProduct] = useState({
        name: '',
        costPrice: '',
        mrp: '',
        discount: '',
        stock: '',
        image: '',
        category: '',
        description: '',
    });

    const [errors, setErrors] = useState({});
    const [submittedProduct, setSubmittedProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formVisible, setFormVisible] = useState(true);

    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports', 'Toys'];

    const validate = () => {
        const errs = {};
        if (!product.name.trim()) errs.name = 'Product name is required';
        if (!product.costPrice || product.costPrice <= 0) errs.costPrice = 'Enter valid cost price';
        if (!product.mrp || product.mrp <= 0) errs.mrp = 'Enter valid MRP';
        if (product.discount < 0 || product.discount > 100) errs.discount = 'Discount must be 0-100';
        if (product.stock < 0) errs.stock = 'Enter valid stock';
        if (!product.image.trim()) errs.image = 'Image URL is required';
        if (!product.category) errs.category = 'Please select a category';
        if (!product.description.trim()) errs.description = 'Description is required';
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericFields = ['costPrice', 'mrp', 'discount', 'stock'];
        setProduct({
            ...product,
            [name]: numericFields.includes(name) ? Number(value) : value,
        });
    };

    const calculateSellingPrice = () => {
        const { mrp, discount } = product;
        if (mrp && discount >= 0) {
            return (mrp - (mrp * discount) / 100).toFixed(2);
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);
            const sellingPrice = calculateSellingPrice();

            try {
                const res = await axios.post('https://myshop-72k8.onrender.com/products/add', {
                    ...product,
                    price: sellingPrice, // final selling price sent to backend
                });

                if (res.status === 201) {
                    toast.success('✅ Product added successfully!');
                    setSubmittedProduct(res.data.product);
                    setProduct({
                        name: '',
                        costPrice: '',
                        mrp: '',
                        discount: '',
                        stock: '',
                        image: '',
                        category: '',
                        description: '',
                    });

                    setTimeout(() => {
                        setSubmittedProduct(null);
                        setFormVisible(false);
                    }, 3000);
                } else {
                    toast.error('Server error. Please try again.');
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to add product');
            } finally {
                setLoading(false);
            }
        }
    };

    if (!formVisible) return null;

    return (
        <div className="relative max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl mt-10 mb-10 transition-all animate-fade-in">
            <ToastContainer />

            {submittedProduct && (
                <button
                    onClick={() => setFormVisible(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition text-2xl font-bold"
                    aria-label="Close"
                >
                    ×
                </button>
            )}

            <h2 className="text-4xl font-bold text-center text-indigo-700 mb-8">🛒 Add New Product</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-semibold text-gray-700">Product Name</label>
                    <input
                        name="name"
                        type="text"
                        value={product.name}
                        onChange={handleChange}
                        placeholder="E.g., Bluetooth Speaker"
                        className={`w-full px-4 py-2 mt-1 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 transition`}
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block font-semibold text-gray-700">Cost Price (₹)</label>
                    <input
                        name="costPrice"
                        type="number"
                        value={product.costPrice}
                        onChange={handleChange}
                        placeholder="Your purchase price (e.g., 100)"
                        className={`w-full px-4 py-2 mt-1 rounded-lg border ${errors.costPrice ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 transition`}
                    />
                    {errors.costPrice && <p className="text-sm text-red-500 mt-1">{errors.costPrice}</p>}
                </div>

                <div>
                    <label className="block font-semibold text-gray-700">MRP (₹)</label>
                    <input
                        name="mrp"
                        type="number"
                        value={product.mrp}
                        onChange={handleChange}
                        placeholder="E.g., 400"
                        className={`w-full px-4 py-2 mt-1 rounded-lg border ${errors.mrp ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 transition`}
                    />
                    {errors.mrp && <p className="text-sm text-red-500 mt-1">{errors.mrp}</p>}
                </div>

                <div>
                    <label className="block font-semibold text-gray-700">Discount (%)</label>
                    <input
                        name="discount"
                        type="number"
                        value={product.discount}
                        onChange={handleChange}
                        placeholder="E.g., 20"
                        className={`w-full px-4 py-2 mt-1 rounded-lg border ${errors.discount ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 transition`}
                    />
                    {errors.discount && <p className="text-sm text-red-500 mt-1">{errors.discount}</p>}
                </div>

                <div>
                    <label className="block font-semibold text-gray-700">Stock</label>
                    <input
                        name="stock"
                        type="number"
                        value={product.stock}
                        onChange={handleChange}
                        placeholder="E.g., 50"
                        className={`w-full px-4 py-2 mt-1 rounded-lg border ${errors.stock ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 transition`}
                    />
                    {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock}</p>}
                </div>

                <div>
                    <label className="block font-semibold text-gray-700">Image URL</label>
                    <input
                        name="image"
                        type="text"
                        value={product.image}
                        onChange={handleChange}
                        placeholder="E.g., https://example.com/image.jpg"
                        className={`w-full px-4 py-2 mt-1 rounded-lg border ${errors.image ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 transition`}
                    />
                    {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
                </div>

                <div>
                    <label className="block font-semibold text-gray-700">Category</label>
                    <select
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 mt-1 rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 transition`}
                    >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block font-semibold text-gray-700">Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        value={product.description}
                        onChange={handleChange}
                        placeholder="Product details, materials, features etc."
                        className={`w-full px-4 py-2 mt-1 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 transition`}
                    />
                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                </div>

                {product.image && !errors.image && (
                    <div className="md:col-span-2 flex justify-center mt-4">
                        <img
                            src={product.image}
                            alt="Preview"
                            className="h-48 w-auto object-cover rounded-lg shadow-md"
                        />
                    </div>
                )}

                {calculateSellingPrice() && (
                    <div className="md:col-span-2 text-center mt-2 text-lg font-medium text-green-700">
                        Final Selling Price: ₹{calculateSellingPrice()}
                    </div>
                )}

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                    >
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>

            {submittedProduct && (
                <div className="mt-10 p-6 bg-gray-50 border rounded-lg shadow-inner animate-fade-in-down">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{submittedProduct.name}</h3>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <img src={submittedProduct.image} alt={submittedProduct.name} className="w-40 h-40 object-cover rounded shadow" />
                        <div className="text-gray-700 space-y-1 text-sm md:text-base">
                            <p><strong>Category:</strong> {submittedProduct.category}</p>
                            <p><strong>Description:</strong> {submittedProduct.description}</p>
                            <p><strong>Cost Price:</strong> ₹{submittedProduct.costPrice}</p>
                            <p><strong>MRP:</strong> ₹{submittedProduct.mrp}</p>
                            <p><strong>Discount:</strong> {submittedProduct.discount}%</p>
                            <p><strong>Stock:</strong> {submittedProduct.stock}</p>
                            <p className="text-indigo-600 font-semibold">Final Price: ₹{submittedProduct.price}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddProductPage;
