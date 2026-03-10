import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const limit = 20;

  const fetchBooks = async (
    pageNumber,
    currentSearch,
    currentSort,
    currentCategory,
    currentPriceRange
  ) => {
    setLoading(true);

    try {
      let minPrice = "";
      let maxPrice = "";

      if (currentPriceRange === "0-200") {
        minPrice = 0;
        maxPrice = 200;
      } else if (currentPriceRange === "201-500") {
        minPrice = 201;
        maxPrice = 500;
      } else if (currentPriceRange === "501-1000") {
        minPrice = 501;
        maxPrice = 1000;
      } else if (currentPriceRange === "1000+") {
        minPrice = 1000;
      }

      const query = new URLSearchParams({
        page: pageNumber,
        limit,
        search: currentSearch,
        sort: currentSort,
        category: currentCategory,
        minPrice,
        maxPrice,
      });

      const res = await fetch(
        `https://book-courier-server-iota.vercel.app/books?${query.toString()}`
      );

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Invalid books response:", data);
        setHasMore(false);
        return;
      }

      if (data.length < limit) {
        setHasMore(false);
      }

      setBooks((prev) => (pageNumber === 1 ? data : [...prev, ...data]));
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page, search, sort, category, priceRange);
  }, [page, search, sort, category, priceRange]);

  const resetAndFetch = () => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
  };

  const handleSearchChange = (e) => {
    resetAndFetch();
    setSearch(e.target.value);
  };

  const handleSortChange = (e) => {
    resetAndFetch();
    setSort(e.target.value);
  };

  const handleCategoryChange = (e) => {
    resetAndFetch();
    setCategory(e.target.value);
  };

  const handlePriceChange = (e) => {
    resetAndFetch();
    setPriceRange(e.target.value);
  };

  return (
    <div className="max-w-full mx-auto bg-amber-50 px-6 md:px-10 py-10">
      {/* Search, Filter, Sort */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={handleSearchChange}
          className="border p-2 rounded-md w-full"
        />

        <select
          value={category}
          onChange={handleCategoryChange}
          className="border p-2 rounded-md w-full"
        >
          <option value="">All Categories</option>
          <option value="Novel">Novel</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Programming">Programming</option>
          <option value="Biography">Biography</option>
        </select>

        <select
          value={priceRange}
          onChange={handlePriceChange}
          className="border p-2 rounded-md w-full"
        >
          <option value="">All Prices</option>
          <option value="0-200">0 - 200</option>
          <option value="201-500">201 - 500</option>
          <option value="501-1000">501 - 1000</option>
          <option value="1000+">1000+</option>
        </select>

        <select
          value={sort}
          onChange={handleSortChange}
          className="border p-2 rounded-md w-full"
        >
          <option value="">Sort by price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <Link key={book._id} to={`/${book._id}`}>
            <div className="bg-[var(--bc-surface)] rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition h-full">
              <img
                src={book.img || "https://placehold.co/300x400?text=No+Cover"}
                alt={book.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x400?text=No+Cover";
                }}
                className="w-full h-60 object-cover"
              />

              <div className="p-4">
                <h3 className="font-semibold text-lg text-[var(--color-primary)]">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {book.category || "Uncategorized"}
                </p>
                <p className="text-[var(--color-primary)] font-semibold mt-2">
                  {book.price || "N/A"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Show More Button */}
      {hasMore && books.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50"
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