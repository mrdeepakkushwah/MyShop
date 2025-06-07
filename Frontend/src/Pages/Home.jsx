import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 mt-10">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12 bg-indigo-600 text-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">Welcome to My Shop</h1>
        <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          Powerful admin and customer tools in one platform. Easily manage users, products, and orders with a few clicks.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to="/login"
            className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="border border-white text-white px-6 py-2 rounded-md hover:bg-white hover:text-indigo-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">What You Can Do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2 text-indigo-600">Manage Users</h3>
            <p className="text-gray-600">View, add, and update users in a streamlined interface.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2 text-indigo-600">Track Orders</h3>
            <p className="text-gray-600">Monitor order history, current status, and customer activity.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2 text-indigo-600">Control Inventory</h3>
            <p className="text-gray-600">Add, edit, and track products with ease in your admin dashboard.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 px-4 sm:px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold mb-10 text-gray-800">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 italic mb-4">
              "This platform saved us hours of manual work every week. Super intuitive!"
            </p>
            <h4 className="font-bold text-indigo-600">— Arjun Singh, Operations Manager</h4>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 italic mb-4">
              "We’ve grown 40% since using YourCompany. The dashboard is a game changer."
            </p>
            <h4 className="font-bold text-indigo-600">— Deepak Kushwah, E-commerce Founder</h4>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 italic mb-4">
              "I love how everything is organized and easy to access. Excellent UX!"
            </p>
            <h4 className="font-bold text-indigo-600">— Priya, Product Lead</h4>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 px-4 sm:px-6 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Stay in the loop</h2>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter for updates and exclusive offers.
        </p>
        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
};

export default Home;
