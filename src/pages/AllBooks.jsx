import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const limit = 20;

  const fetchBooks = async (pageNumber, currentSearch, currentSort) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://book-courier-server-iota.vercel.app/books?page=${pageNumber}&limit=${limit}&search=${currentSearch}&sort=${currentSort}`
      );
      const data = await res.json();

if (!Array.isArray(data)) {
      console.error("Invalid books response:", data);
      setHasMore(false);
      return;
    }

    if (data.length < limit) setHasMore(false);

    setBooks((prev) =>
      pageNumber === 1 ? data : [...prev, ...data]
    );
  } catch (err) {
    console.error("Error fetching books:", err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchBooks(page, search, sort);
  }, [page, search, sort]);

  const handleSearchChange = (e) => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
    setSearch(e.target.value);
  };

  const handleSortChange = (e) => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
    setSort(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Search & Sort */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={handleSearchChange}
          className="border p-2 rounded-md w-1/2"
        />
        <select
          value={sort}
          onChange={handleSortChange}
          className="border p-2 rounded-md"
        >
          <option value="">Sort by price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <Link key={book._id} to={`/books/${book._id}`}>
            <div className="bg-[var(--bc-surface)] rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition">
              <img
                src={book.img || "https://via.placeholder.com/150"}
                alt={book.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[var(--color-primary)]">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-[var(--color-primary)] font-semibold mt-2">
                  {book.price || "N/A"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Show More Button */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-dark)] transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Show More Books"}
          </button>
        </div>
      )}

      {!books.length && !loading && (
        <p className="text-center py-10">No books found.</p>
      )}
    </div>
  );
};

export default AllBooks;
