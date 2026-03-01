import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthProvider";
import OrderModal from "./modals/OrderModal";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

// const API = "https://book-courier-server-iota.vercel.app";
const API = "http://localhost:3000";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { user } = useAuth();
  const { addToCart, clearCart } = useCart();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [orderData, setOrderData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    setOrderData((prev) => ({
      ...prev,
      name: user?.displayName || "",
      email: user?.email || "",
    }));
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/books/${id}`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.error("Book fetch failed:", res.status, data);
          if (!cancelled) setBook(null);
          return;
        }

        if (!cancelled) setBook(data);
      } catch (err) {
        console.error("Book fetch error:", err);
        if (!cancelled) setBook(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (id) fetchBook();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const priceNumber = useMemo(() => {
    if (!book?.price) return 0;
    const p = Number(String(book.price).replace(/[^0-9.]/g, ""));
    return Number.isFinite(p) ? p : 0;
  }, [book]);

  const handleChange = (e) => {
    setOrderData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    if (!book) return;
    addToCart({ ...book, quantity });
    toast.success(`${book.title} added to cart`);
  };

  const handleOrderNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  const placeOrder = async () => {
    try {
      if (!user) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }
      if (!book?._id) {
        toast.error("Book not loaded");
        return;
      }

      const numericPrice = Number(String(book.price).replace(/[^0-9.]/g, ""));
      const token = await user.getIdToken();

      const payload = {
        name: orderData.name,
        phone: orderData.phone,
        address: orderData.address,
        bookId: book._id,
        quantity,
        bookTitle: book.title,
        price: numericPrice,
        orderStatus: "pending",
        paymentStatus: "unpaid",
      };

      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Order failed:", res.status, data);
        toast.error(data.message || "Failed to place order");
        return;
      }

      setShowModal(false);
      clearCart?.();
      toast.success("Order placed successfully!");
      navigate("/dashboard/my-orders");
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Failed to place order");
    }
  };


  const refreshWishlistState = async () => {
    if (!user?.email || !book?._id) return;
    try {
      setWishlistLoading(true);
      const res = await axiosSecure.get("/wishlist");
      const list = Array.isArray(res.data) ? res.data : [];

      const found = list.find((w) => String(w.bookId) === String(book._id));
      setWishlisted(!!found);
      setWishlistItemId(found?._id || null);
    } catch (err) {
      console.error("Wishlist load error:", err?.response?.data || err.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    if (!book?._id) return;

    try {
      setWishlistLoading(true);

      if (!wishlisted) {
        const res = await axiosSecure.post("/wishlist", { bookId: String(book._id) });
        setWishlisted(true);
        setWishlistItemId(res.data?.insertedId || res.data?.item?._id || null);
        toast.success("Added to wishlist");
      } else {
        if (!wishlistItemId) {
          await refreshWishlistState();
        }
        await axiosSecure.delete(`/wishlist/${wishlistItemId}`);
        setWishlisted(false);
        setWishlistItemId(null);
        toast.success("Removed from wishlist");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Wishlist failed");
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    if (user && book?._id) refreshWishlistState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, book?._id]);

  const loadReviews = async () => {
    if (!book?._id) return;
    try {
      setReviewsLoading(true);
      const res = await fetch(
        `${API}/reviews?bookId=${encodeURIComponent(String(book._id))}`
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to load reviews");
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (err) {
      console.error("Load reviews error:", err);
      toast.error(err.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadEligibility = async () => {
    if (!user || !book?._id) {
      setCanReview(false);
      return;
    }
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `${API}/reviews/eligibility/${encodeURIComponent(String(book._id))}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json().catch(() => ({}));
      setCanReview(!!data.canReview);
    } catch (err) {
      console.error("Eligibility error:", err);
      setCanReview(false);
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast.error("Please login to review");
      navigate("/login");
      return;
    }
    if (!book?._id) return;

    const ratingNum = Number(reviewForm.rating);
    if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    try {
      setReviewSubmitting(true);
      const token = await user.getIdToken();

      const res = await fetch(`${API}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: String(book._id),
          rating: ratingNum,
          review: reviewForm.review,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to submit review");

      toast.success("Review submitted!");
      setReviewForm({ rating: 5, review: "" });

      await loadReviews();
      await loadEligibility();
    } catch (err) {
      toast.error(err.message || "Review failed");
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    if (!book?._id) return;
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?._id]);

  useEffect(() => {
    if (!book?._id) return;
    loadEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, book?._id]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!book) return <p className="text-center py-10">Book not found</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 bg-(--bc-bg) rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={book.img || book.image || "https://via.placeholder.com/200"}
          alt={book.title || "Book"}
          className="w-full md:w-1/3 h-auto object-cover rounded-lg shadow-sm"
        />

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-[var(--color-primary)] text-5xl font-bold mb-2">
                {book.title}
              </h1>
            </div>

            {/* Wishlist toggle */}
            <button
              onClick={toggleWishlist}
              disabled={wishlistLoading}
              title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`p-3 border rounded-full transition ${
                wishlisted ? "bg-red-50" : "bg-white hover:bg-gray-100"
              } disabled:opacity-60`}
            >
              {wishlisted ? "💖" : "❤️"}
            </button>
          </div>

          <p className="text-[var(--bc-text)] text-xl mb-1">
            <strong>Author:</strong> {book.author || "—"}
          </p>
          <p className="text-[var(--bc-text)] text-xl mb-1">
            <strong>Category:</strong> {book.category || "—"}
          </p>
          <p className="text-[var(--bc-text)] text-xl mb-1">
            <strong>Language:</strong> {book.language || "—"}
          </p>

          <p className="text-[var(--bc-accent)] text-2xl font-semibold mt-4">
            ${priceNumber.toFixed(2)}
          </p>

          <p className="text-[var(--bc-text)] mt-4">{book.desc || ""}</p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-4 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
              Read A Little
            </button>

            <button
              onClick={handleAddToCart}
              className="px-6 py-2 bg-(--color-primary) text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <span className="text-xl">🛒</span> Add To Cart
            </button>
          </div>
          <button
            onClick={handleOrderNow}
            className="mt-6 px-6 py-2 w-full rounded-lg bg-(--color-primary) text-white font-semibold hover:bg-(--bc-accent) transition"
          >
            Order Now
          </button>
        </div>
      </div>

      <OrderModal
        showModal={showModal}
        setShowModal={setShowModal}
        orderData={orderData}
        handleChange={handleChange}
        placeOrder={placeOrder}
      />

      {/* -------------------------
          Reviews Section
      -------------------------- */}
      <div className="mt-10 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-md">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[var(--bc-text)]">Reviews</h2>
            <p className="text-sm text-[var(--bc-text)]/70 mt-1">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}{" "}
              {reviews.length ? `• Avg ⭐ ${avgRating.toFixed(1)}` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={loadReviews}
            className="btn btn-outline btn-sm rounded-xl"
            disabled={reviewsLoading}
          >
            {reviewsLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Write review */}
        <div className="mt-5 rounded-xl border border-base-300 bg-base-200/40 p-4">
          {!user ? (
            <div className="text-sm text-[var(--bc-text)]/70">
              Please{" "}
              <button
                className="font-semibold text-[var(--color-primary)] underline"
                onClick={() => navigate("/login")}
                type="button"
              >
                login
              </button>{" "}
              to write a review.
            </div>
          ) : !canReview ? (
            <div className="text-sm text-[var(--bc-text)]/70">
              You can review this book after you order it.
            </div>
          ) : (
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm font-semibold text-[var(--bc-text)]">
                  Rating
                </label>
                <select
                  className="select select-bordered select-sm rounded-xl"
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm((p) => ({
                      ...p,
                      rating: Number(e.target.value),
                    }))
                  }
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Okay</option>
                  <option value={2}>2 - Bad</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>

              <textarea
                className="textarea textarea-bordered w-full rounded-xl"
                rows={3}
                placeholder="Write your experience..."
                value={reviewForm.review}
                onChange={(e) =>
                  setReviewForm((p) => ({ ...p, review: e.target.value }))
                }
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={reviewSubmitting}
                  onClick={submitReview}
                  className="btn btn-primary rounded-xl"
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline rounded-xl"
                  onClick={() => setReviewForm({ rating: 5, review: "" })}
                  disabled={reviewSubmitting}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reviews list */}
        <div className="mt-6">
          {reviewsLoading ? (
            <p className="text-center text-sm text-[var(--bc-text)]/70">
              Loading reviews...
            </p>
          ) : reviews.length === 0 ? (
            <div className="rounded-xl border border-base-300 bg-base-100 p-6 text-center text-sm text-[var(--bc-text)]/70">
              No reviews yet. Be the first to review!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => {
                const d = r?.createdAt ? new Date(r.createdAt) : null;
                const dateLabel =
                  d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString() : "";

                return (
                  <div
                    key={r._id}
                    className="rounded-2xl border border-base-300 bg-base-100 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-[var(--bc-text)]">
                        {r.email || "Anonymous"}
                      </div>
                      <div className="text-xs text-[var(--bc-text)]/60">
                        {dateLabel}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="badge badge-primary rounded-xl">
                        ⭐ {Number(r.rating || 0).toFixed(1)}
                      </span>
                    </div>

                    {r.review ? (
                      <p className="mt-2 text-sm text-[var(--bc-text)]/80">
                        {r.review}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;