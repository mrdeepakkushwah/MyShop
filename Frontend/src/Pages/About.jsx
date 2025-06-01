import React, { useEffect, useState } from 'react';

const heroImages = [
  'https://images.unsplash.com/photo-1585386959984-a4155224a1c1?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1609947024030-6373c69a1821?auto=format&fit=crop&w=1400&q=80',
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
  'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_Tesla_Motors.svg',
  'https://upload.wikimedia.org/wikipedia/commons/4/44/Apple_logo_black.svg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/f/fa/Google_Logo.svg',
];

const About = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative h-[80vh] bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('${heroImages[currentImage]}')` }}
      >
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold text-center px-4">
            Discover the People Behind Our Passion
          </h1>
        </div>
      </div>

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

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all text-center p-6"
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
              <div key={i} className="bg-white rounded-xl shadow p-6">
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
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {partners.map((logo, i) => (
              <img key={i} src={logo} alt="partner" className="h-12 object-contain grayscale hover:grayscale-0 transition" />
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Get in Touch</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-center items-center gap-3">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a1 1 0 001.22 0L20 8" />
                <path d="M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
              </svg>
              <span>deepakKushwah475110@gmail.com</span>
            </div>
            <div className="flex justify-center items-center gap-3">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 5h2l3 7v6h8v-6l3-7h2" />
              </svg>
              <span>+91-9109001109</span>
            </div>
            <div className="flex justify-center items-center gap-3">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2C8 2 4 5 4 9c0 4.25 6.6 11.7 7.23 12.38a1 1 0 001.54 0C13.4 20.7 20 13.25 20 9c0-4-4-7-8-7z" />
              </svg>
              <span>Ward 15 Ramgarh Street Dabra, Springfield</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
