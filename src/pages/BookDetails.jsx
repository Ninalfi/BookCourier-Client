import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState({
    name: "User Name",
    email: "user@example.com",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:3000/books/${id}`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    try {
      await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...orderData, bookId: book._id, userId: "123456" }),
      });
      setShowModal(false);
      alert("Order placed successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!book) return <p className="text-center py-10">Book not found</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 bg-[var(--bc-bg)] rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={book.img || "https://via.placeholder.com/200"}
          alt={book.title}
          className="w-full md:w-1/3 h-auto object-cover rounded-lg shadow-sm"
        />
        <div className="flex-1">
          <h1 className="text-[var(--color-primary)] text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-[var(--bc-text)] text-lg mb-1"><strong>Author:</strong> {book.author}</p>
          <p className="text-[var(--bc-text)] text-lg mb-1"><strong>Category:</strong> {book.category}</p>
          <p className="text-[var(--bc-text)] text-lg mb-1"><strong>Language:</strong> {book.language}</p>
          <p className="text-[var(--bc-accent)] text-xl font-semibold mt-4">{book.price}</p>
          <p className="text-[var(--bc-text)] mt-4">{book.desc}</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--bc-accent)] transition"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--bc-surface)] p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <h2 className="text-[var(--color-primary)] text-2xl font-bold mb-4">Place Your Order</h2>
            <input
              type="text"
              name="name"
              value={orderData.name}
              readOnly
              className="w-full mb-3 p-2 border border-gray-300 rounded"
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={orderData.email}
              readOnly
              className="w-full mb-3 p-2 border border-gray-300 rounded"
              placeholder="Email"
            />
            <input
              type="text"
              name="phone"
              value={orderData.phone}
              onChange={handleChange}
              className="w-full mb-3 p-2 border border-gray-300 rounded"
              placeholder="Phone Number"
            />
            <textarea
              name="address"
              value={orderData.address}
              onChange={handleChange}
              className="w-full mb-3 p-2 border border-gray-300 rounded"
              placeholder="Address"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={placeOrder}
                className="px-4 py-2 rounded bg-[var(--bc-accent)] text-white hover:bg-[var(--color-primary)] transition"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
