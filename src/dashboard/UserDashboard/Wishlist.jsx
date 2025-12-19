import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { FaHeartBroken, FaTrashAlt } from "react-icons/fa";

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist
  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:3000/wishlist?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        setWishlist(data);
        setLoading(false);
      });
  }, [user?.email]);

  // Remove item
  const handleRemove = (id) => {
    fetch(`http://localhost:3000/wishlist/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(() => {
        setWishlist(prev => prev.filter(item => item._id !== id));
      });
  };

  return (
    <div className="p-6 min-h-screen bg-[var(--bc-bg)]">

      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[var(--color-primary)]">
          My Wishlist
        </h2>
        <p className="text-[var(--bc-text)]/70">
          Books you saved for later
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-[var(--bc-surface)] p-4 rounded-xl shadow">
              <div className="h-48 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && wishlist.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FaHeartBroken className="text-6xl text-[var(--bc-accent)] mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600">
            Browse books and add your favorites here.
          </p>
        </div>
      )}

      {/* Wishlist Cards */}
      {!loading && wishlist.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(book => (
            <div
              key={book._id}
              className="bg-[var(--bc-surface)] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={book.img}
                alt={book.title}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold text-[var(--bc-text)]">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {book.author}
                </p>
                <p className="font-bold text-[var(--color-primary)] mb-4">
                  {book.price}
                </p>

                <button
                  onClick={() => handleRemove(book._id)}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[var(--bc-accent)] text-white hover:opacity-90 transition"
                >
                  <FaTrashAlt />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
