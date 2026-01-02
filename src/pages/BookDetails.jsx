import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthProvider";
import OrderModal from "./modals/OrderModal";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

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
    alert(`${book.title} added to cart`);
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
        alert("Please login first");
        navigate("/login");
        return;
      }
      if (!book?._id) {
        alert("Book not loaded");
        return;
      }
      const numericPrice = Number(
  String(book.price).replace(/[^0-9.]/g, "")
);

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
        alert(data.message || "Failed to place order");
        return;
      }

      setShowModal(false);
      clearCart?.();
      alert("Order placed successfully!");
      navigate("/dashboard/my-orders");
  
    } catch (err) {
      console.error("Order error:", err);
      alert("Failed to place order");
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


  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!book) return <p className="text-center py-10">Book not found</p>;

return (
  <div className="max-w-4xl mx-auto py-10 px-4 bg-(--bc-bg) rounded-lg shadow-md">
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

        <div className="flex gap-3 mt-4">
          <button className="p-3 bg-white border rounded-full hover:bg-gray-100">
            🔄
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
  </div>
);
};

export default BookDetails;
