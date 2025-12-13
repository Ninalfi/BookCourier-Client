import React from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    review: "BookCourier makes finding rare books so easy! Fast delivery and excellent service.",
    rating: 5
  },
  {
    id: 2,
    name: "David Lee",
    review: "I love their collection of children’s books. My kids are always excited for new stories!",
    rating: 4
  },
  {
    id: 3,
    name: "Priya Singh",
    review: "Affordable prices, easy exchange offers, and a seamless experience overall.",
    rating: 5
  },
];

const Reviews = () => {
  return (
    <section className="py-20 bg-(--bc-bg)">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-(--color-primary) mb-12 text-center">
          What Our Readers Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[var(--bc-surface)] p-6 rounded-xl shadow-lg relative"
            >
              <FaQuoteLeft className="text-[var(--color-primary)] text-2xl mb-4" />
              <p className="text-gray-700 mb-4">{t.review}</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--color-primary)]">{t.name}</span>
                <span className="flex gap-1 text-yellow-400">
                  {Array(t.rating).fill(0).map((_, i) => <FaStar key={i} />)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
