import React from "react";
import { Link } from "react-router-dom";
import {
    FaFacebookF,
    FaInstagram,
    FaXTwitter,
    FaGithub,
    FaYoutube,
} from "react-icons/fa6";

export default function ShopFooter() {
    return (
        <footer
            className="text-gray-300 pt-10 pb-10 px-6 md:px-16"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                zIndex: 1
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-80 -z-10"></div>

            {/* Top Section */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 z-10 relative">
                {/* Column 1: Solutions */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Solutions</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/marketing">Marketing</Link></li>
                        <li><Link to="/analytics">Analytics</Link></li>
                        <li><Link to="/automation">Automation</Link></li>
                        <li><Link to="/commerce">Commerce</Link></li>
                        <li><Link to="/insights">Insights</Link></li>
                    </ul>
                </div>

                {/* Column 2: Support */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Support</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/support">Submit Ticket</Link></li>
                        <li><Link to="/docs">Documentation</Link></li>
                        <li><Link to="/guides">Guides</Link></li>
                    </ul>
                </div>

                {/* Column 3: Company */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Company</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/blog">Blog</Link></li>
                        <li><Link to="/jobs">Jobs</Link></li>
                        <li><Link to="/press">Press</Link></li>
                    </ul>
                </div>

                {/* Column 4: Legal */}
                <div>
                    <h3 className="text-white font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/terms">Terms of Service</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/license">License</Link></li>
                    </ul>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="max-w-7xl mx-auto mt-10 border-t border-gray-700 pt-8 flex flex-col lg:flex-row justify-between gap-6 relative z-10">
                <div>
                    <h4 className="text-white font-semibold mb-2">Subscribe to our newsletter</h4>
                    <p className="text-sm text-gray-400">
                        The latest news, articles, and resources, sent to your inbox weekly.
                    </p>
                </div>

                <form className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none w-full sm:w-64"
                    />
                    <button
                        type="submit"
                        className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md"
                    >
                        Subscribe
                    </button>
                </form>
            </div>

            {/* Bottom Section */}
            <div className="max-w-7xl mx-auto mt-8 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm relative z-10">
                <p className="text-gray-400 mb-4 sm:mb-0">
                    © 2024 MyShop. All rights reserved.
                </p>
                <div className="flex space-x-4 text-white text-lg">
                    <FaFacebookF className="hover:text-indigo-400 cursor-pointer" />
                    <FaInstagram className="hover:text-pink-400 cursor-pointer" />
                    <FaXTwitter className="hover:text-blue-400 cursor-pointer" />
                    <FaGithub className="hover:text-gray-400 cursor-pointer" />
                    <FaYoutube className="hover:text-red-500 cursor-pointer" />
                </div>
            </div>
        </footer>
    );
}
