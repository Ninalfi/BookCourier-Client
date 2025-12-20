import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import OrderModal from "./modals/OrderModal";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router";

const BookDetails = () => {
  const { id } = useParams();
  const { addToCart, clearCart  } = useCart(); 
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
   const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState({
    name: user?.displayName || "",
    email:  user?.email || "",
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

   useEffect(() => {
    setOrderData((prev) => ({
      ...prev,
      name: user?.displayName || "",
      email: user?.email || "",
    }));
  }, [user]);

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

   const handleAddToCart = () => {
    addToCart({ ...book, quantity });
    alert(`${book.title} added to cart`);
  };

   const handleOrderNow = () => {
    setShowModal(true);
  };

     const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const placeOrder = async () => {
    try {
      await fetch("http://localhost:3000/my-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...orderData, bookId: book._id, userId: "123456", quantity, bookTitle: book.title, price: book.price, name: orderData.name, orderStatus:"pending",paymentStatus: "unpaid" }),
      });
      setShowModal(false);
      alert("Order placed successfully!");
      clearCart();
      navigate("/dashboard/my-orders");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!book) return <p className="text-center py-10">Book not found</p>;



  return (
    <div className="max-w-4xl mx-auto py-10 px-4 bg-(--bc-bg) rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={book.img || "https://via.placeholder.com/200"}
          alt={book.title}
          className="w-full md:w-1/3 h-auto object-cover rounded-lg shadow-sm"
        />
        <div className="flex-1">
          <h1 className="text-[var(--color-primary)] text-5xl font-bold mb-2">{book.title}</h1>
          <p className="text-[var(--bc-text)] text-xl mb-1"><strong>Author:</strong> {book.author}</p>
          <p className="text-[var(--bc-text)] text-xl mb-1"><strong>Category:</strong> {book.category}</p>
          <p className="text-[var(--bc-text)] text-xl mb-1"><strong>Language:</strong> {book.language}</p>
          <p className="text-[var(--bc-accent)] text-2xl font-semibold mt-4">{typeof book.price === "number" ? `$${book.price}` : book.price}</p>
          <p className="text-[var(--bc-text)] mt-4">{book.desc}</p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-3 mt-4">
             <button
                onClick={() => handleQuantityChange(-1)}
                className="px-4 py-2 hover:bg-gray-100"
              > -</button>
               <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-4 py-2 hover:bg-gray-100"
              > + </button>
            </div>
         <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
              Read A Little
            </button>
             {/* Add to Cart */}
            <button
            onClick={handleAddToCart}
             className="px-6 py-2 bg-(--color-primary) text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <span className="text-xl">🛒</span> Add To Cart
            </button>
          </div>
                    <div className="flex gap-3 mt-4">
            <button className="p-3 bg-white border rounded-full hover:bg-gray-100">
              ❤️
            </button>
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

      {/* Modal */}
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
