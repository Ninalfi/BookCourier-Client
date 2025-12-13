import React from "react";
import { motion } from "framer-motion";
import { FaShippingFast, FaBookOpen, FaLock, FaHeadset } from "react-icons/fa";

const WhyUs = () => {
  const features = [
    {
      id: 1,
      icon: <FaShippingFast className="text-[var(--color-primary)] w-10 h-10 mx-auto mb-4" />,
      title: "Fast & Reliable Delivery",
      desc: "Get your books delivered quickly and safely to your doorstep."
    },
    {
      id: 2,
      icon: <FaBookOpen className="text-[var(--color-primary)] w-10 h-10 mx-auto mb-4" />,
      title: "Vast Collection",
      desc: "Thousands of books across multiple genres and languages."
    },
    {
      id: 3,
      icon: <FaLock className="text-[var(--color-primary)] w-10 h-10 mx-auto mb-4" />,
      title: "Secure Payment",
      desc: "Your transactions are safe with our encrypted payment system."
    },
    {
      id: 4,
      icon: <FaHeadset className="text-[var(--color-primary)] w-10 h-10 mx-auto mb-4" />,
      title: "24/7 Customer Support",
      desc: "We are always ready to help you with your queries."
    },
  ];

  return (
     <section className="relative py-20 bg-[var(--bc-bg)] overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[var(--bc-accent)] rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[var(--color-primary)] rounded-full opacity-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl font-bold text-center text-[var(--color-primary)] mb-16"
        >
          Why Choose BookCourier
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="bg-[var(--bc-surface)] rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition-transform duration-500"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-700">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
