import React from "react";
import { FaExchangeAlt, FaGift, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const exchangeOffers = [
  {
    id: 1,
    icon: <FaExchangeAlt className="text-[var(--color-primary)] w-12 h-12 mb-4 mx-auto" />,
    title: "Book Exchange",
    desc: "Trade your old books for new titles at discounted rates."
  },
  {
    id: 2,
    icon: <FaGift className="text-[var(--color-primary)] w-12 h-12 mb-4 mx-auto" />,
    title: "Gift Cards",
    desc: "Purchase gift cards for friends and family, perfect for book lovers."
  },
  {
    id: 3,
    icon: <FaStar className="text-[var(--color-primary)] w-12 h-12 mb-4 mx-auto" />,
    title: "Exclusive Rewards",
    desc: "Earn reward points on each purchase and redeem them later."
  },
];

const ExchangeOffers = () => {
  return (
    <section className="py-20 bg-[var(--bc-surface)]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-[var(--color-primary)] mb-12 text-center">
          Exchange Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {exchangeOffers.map((offer, idx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="bg-[var(--bc-bg)] rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition-transform"
            >
              {offer.icon}
              <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
              <p className="text-gray-700">{offer.desc}</p>
              <button className="mt-4 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--bc-accent)] text-white rounded-lg transition">
                Learn More
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExchangeOffers;
