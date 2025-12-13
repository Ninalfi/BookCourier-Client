import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const slides = [
  {
    id: 1,
    img: "https://unsplash.com/photos/a-stack-of-books-sitting-on-top-of-a-wooden-table-BbVUxPwQiDM",
    title: "Discover Bestsellers",
    desc: "Handpicked bestsellers delivered to your door.",
    btn_text: "Discover Now",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80",
    title: "Rare & Classic",
    desc: "Find rare editions and timeless classics.",
    btn_text: "Explore Now",
  },
 {
    id: 3,
    img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
    title: "Hot Deals",
    desc: "Limited-time deals for avid readers.",
    btn_text: "Shop Now",
  },
   {
    id: 4,
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    title: "New Arrivals",
    desc: "Check out the latest books added to our collection.",
    btn_text: "Browse Now",
  },
    {
    id: 5,
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    title: "Exchange Offers",
    desc: "Exchange old books and get new titles at amazing rates.",
    btn_text: "Grab Now",
  },
    {
    id: 6,
    img: "https://images.unsplash.com/photo-1581091215366-7f7480f1b29c?auto=format&fit=crop&w=1200&q=80",
    title: "Limited Edition",
    desc: "Rare and collectible editions you won't find anywhere else.",
    btn_text: "Explore Now",
  },
];

const Banner = () => {
  return (
    <section className="py-10 bg-[var(--bc-bg)]">
      <div className="max-w-7xl mx-auto">
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          interval={4000}
          showStatus={false}
          swipeable
          emulateTouch
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative h-[420px] sm:h-[520px] rounded-lg overflow-hidden"
            >
              <img
                src={slide.img}
                alt={slide.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-start px-6 sm:px-12">
                <div className="max-w-xl text-[var(--bc-surface)]">
                  <h3 className="text-xl sm:text-3xl font-bold">{slide.title}</h3>
                  <p className="mt-2 text-sm sm:text-base">{slide.desc}</p>
                  <Link
                    to="/books"
                    className="mt-4 inline-block px-4 py-2 rounded-lg font-semibold bg-[var(--color-primary)] hover:bg-[var(--bc-accent)] transition text-[var(--bc-surface)]"
                  >
                    {slide.btn_text || "Shop Now"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default Banner;
