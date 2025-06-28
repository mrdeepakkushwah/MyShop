import React from 'react';
import Navbar from '../Components/Navbar';

const heroImages = [
  'https://images.unsplash.com/photo-1585386959984-a4155224a1c1?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1609947024030-6373c69a1821?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80',
];

const team = [
  {
    name: 'Deepak Kushwah',
    role: 'Founder & CEO',
    image: 'https://res.cloudinary.com/dy5s3zplq/image/upload/t_Profile/v1748423179/poto_ezrfbt.jpg',
  },
  {
    name: 'Liam Johnson',
    role: 'Head of Product',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    name: 'Sophia Williams',
    role: 'Customer Support Lead',
    image: 'https://randomuser.me/api/portraits/women/46.jpg',
  },
];

const testimonials = [
  {
    name: 'Aarav Singh',
    feedback: 'Amazing products and fast delivery! Love the eco-friendly packaging.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Maya Patel',
    feedback: 'Customer service is top-notch. Highly recommend this shop!',
    image: 'https://randomuser.me/api/portraits/women/29.jpg',
  },
];


const partners = [
  'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tesla.svg',
  'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
];


const About = () => {
  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <h1 className="text-white text-4xl md:text-6xl font-extrabold text-center px-4">
            Discover the People Behind Our Passion
          </h1>
        </div>
        <div className="absolute top-0 left-0 flex h-full w-[300%] animate-scroll">
          {heroImages.concat(heroImages).map((img, index) => (
            <div key={index} className="h-full w-[20%] flex-shrink-0">
              <img
                src={img}
                alt="Hero"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Mission */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            At our eCommerce shop, we strive to bring you high-quality, sustainable products with a focus
            on customer satisfaction, ethical sourcing, and seamless shopping experiences.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Why Choose Us</h2>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8 text-center">
            {[
              ['🌱', 'Eco-Friendly Products'],
              ['⚡', 'Fast & Reliable Delivery'],
              ['💬', '24/7 Support'],
              ['🔒', 'Secure Payments'],
            ].map(([icon, title], i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all text-center p-6 transform hover:-translate-y-2"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-blue-500"
                />
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">What Our Customers Say</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow p-6 transition transform hover:scale-105"
              >
                <p className="text-gray-600 mb-4 italic">"{t.feedback}"</p>
                <div className="flex items-center justify-center gap-3">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full" />
                  <span className="font-semibold text-gray-800">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="mb-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Trusted Partners</h2>
          <div className="flex justify-center items-center gap-8 flex-wrap animate-fadeIn">
            {partners.map((logo, i) => (
              <img
                key={i}
                src={logo}
                alt="partner"
                className="h-12 object-contain grayscale hover:grayscale-0 transition"
              />
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Get in Touch</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-center items-center gap-3">
              <span>📧</span>
              <span>deepakKushwah475110@gmail.com</span>
            </div>
            <div className="flex justify-center items-center gap-3">
              <span>📞</span>
              <span>+91-9109001109</span>
            </div>
            <div className="flex justify-center items-center gap-3">
              <span>📍</span>
              <span>Ward 15 Ramgarh Street Dabra</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
