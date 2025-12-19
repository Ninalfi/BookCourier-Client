import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthProvider";


const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      const docRef = doc(db, "books", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBook({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchBook();
  }, [id]);

  const handlePlaceOrder = async () => {
    if (!phone || !address) return alert("Please fill all fields!");
    setOrdering(true);
    try {
      await addDoc(collection(db, "orders"), {
        bookId: book.id,
        bookTitle: book.title,
        userId: user.uid,
        name: user.displayName,
        email: user.email,
        phone,
        address,
        status: "pending",
        payment: "unpaid",
        createdAt: new Date()
      });
      setModalOpen(false);
      setPhone("");
      setAddress("");
      alert("Order placed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    }
    setOrdering(false);
  };

  if (loading) return <p className="text-center py-10">Loading book...</p>;
  if (!book) return <p className="text-center py-10">Book not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={book.img} alt={book.title} className="w-full md:w-1/3 h-80 object-cover rounded-lg" />
        <div className="md:flex-1">
          <h2 className="text-3xl font-bold">{book.title}</h2>
          <p className="text-gray-600 mt-1">By {book.author}</p>
          <p className="text-[var(--color-primary)] font-semibold mt-2">{book.price}</p>
          <p className="mt-4">{book.desc}</p>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 px-6 py-2 bg-[var(--color-primary)] hover:bg-[var(--bc-accent)] text-white rounded-lg transition"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--bc-surface)] rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4">Place Order</h3>
            <div className="space-y-3">
              <input type="text" value={user.displayName} readOnly className="input input-bordered w-full" />
              <input type="email" value={user.email} readOnly className="input input-bordered w-full" />
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input input-bordered w-full"
              />
              <textarea
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input input-bordered w-full h-24"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={ordering}
                  className="px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--bc-accent)] text-white"
                >
                  {ordering ? "Placing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
