import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add email validation or API integration here
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50 mt-10">
      {/* Hero Section */}
      <section
        className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 sm:py-24 text-white bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://source.unsplash.com/1600x900/?shopping,ecommerce')", // Replace with your own image
        }}
      >
        <div className="absolute inset-0 bg-indigo-800 bg-opacity-60 z-0"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Welcome to My Shop
          </h1>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed">
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
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-10 text-gray-800">What You Can Do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Manage Users",
              desc: "View, add, and update users in a streamlined interface.",
            },
            {
              title: "Track Orders",
              desc: "Monitor order history, current status, and customer activity.",
            },
            {
              title: "Control Inventory",
              desc: "Add, edit, and track products with ease in your admin dashboard.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition"
            >
              <h3 className="text-xl font-bold mb-2 text-indigo-600">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold mb-10 text-gray-800">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              text: `"This platform saved us hours of manual work every week. Super intuitive!"`,
              name: "— Arjun Singh, Operations Manager",
            },
            {
              text: `"We’ve grown 40% since using My Shop. The dashboard is a game changer."`,
              name: "— Deepak Kushwah, E-commerce Founder",
            },
            {
              text: `"I love how everything is organized and easy to access. Excellent UX!"`,
              name: "— Priya, Product Lead",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="text-gray-600 italic mb-4">{item.text}</p>
              <h4 className="font-bold text-indigo-600">{item.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 sm:px-6 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">
          Stay in the loop
        </h2>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter for updates and exclusive offers.
        </p>
        <form
          onSubmit={handleSubscribe}
          className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            required
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
    </main>
  );
};

export default Home;
