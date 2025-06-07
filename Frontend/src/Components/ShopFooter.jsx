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
            className="text-gray-300 pt-12 pb-10 px-6 md:px-16 relative overflow-hidden"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/80"></div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-12">

                {/* Top Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Solutions */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Solutions</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/marketing" className="hover:text-indigo-400">Marketing</Link></li>
                            <li><Link to="/analytics" className="hover:text-indigo-400">Analytics</Link></li>
                            <li><Link to="/automation" className="hover:text-indigo-400">Automation</Link></li>
                            <li><Link to="/commerce" className="hover:text-indigo-400">Commerce</Link></li>
                            <li><Link to="/insights" className="hover:text-indigo-400">Insights</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/support" className="hover:text-indigo-400">Submit Ticket</Link></li>
                            <li><Link to="/docs" className="hover:text-indigo-400">Documentation</Link></li>
                            <li><Link to="/guides" className="hover:text-indigo-400">Guides</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/about" className="hover:text-indigo-400">About</Link></li>
                            <li><Link to="/blog" className="hover:text-indigo-400">Blog</Link></li>
                            <li><Link to="/jobs" className="hover:text-indigo-400">Jobs</Link></li>
                            <li><Link to="/press" className="hover:text-indigo-400">Press</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/terms" className="hover:text-indigo-400">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-indigo-400">Privacy Policy</Link></li>
                            <li><Link to="/license" className="hover:text-indigo-400">License</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 border-t border-gray-700 pt-8">
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
                            className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-md"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center text-sm border-t border-gray-700 pt-6">
                    <p className="text-gray-400 mb-4 sm:mb-0">
                        © 2024 MyShop. All rights reserved.
                    </p>
                    <div className="flex space-x-4 text-white text-lg">
                        <a href="#" aria-label="Facebook" className="hover:text-indigo-400">
                            <FaFacebookF />
                        </a>
                        <a href="#" aria-label="Instagram" className="hover:text-pink-400">
                            <FaInstagram />
                        </a>
                        <a href="#" aria-label="Twitter" className="hover:text-blue-400">
                            <FaXTwitter />
                        </a>
                        <a href="#" aria-label="GitHub" className="hover:text-gray-400">
                            <FaGithub />
                        </a>
                        <a href="#" aria-label="YouTube" className="hover:text-red-500">
                            <FaYoutube />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
