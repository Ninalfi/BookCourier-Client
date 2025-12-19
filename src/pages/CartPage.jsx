import React, { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import OrderModal from "./modals/OrderModal";
import { useCart } from "../contexts/CartContext";


const CartPage = () => {
  const { cart, totalItems, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };


  const placeOrder = async () => {
    try {
      const orders = cart.map((item) => ({
        ...orderData,
        bookId: item._id,
        quantity: item.quantity,
        userId: user?.uid || "guest",
      }));

      await fetch("http://localhost:3000/my-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orders),
      });

      alert("Order placed successfully!");
      clearCart();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (cart.length === 0)
    return <p className="text-center py-10">Your cart is empty</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart ({totalItems} items)</h1>

      <ul className="flex flex-col gap-4">
        {cart.map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-center border p-4 rounded"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.img}
                alt={item.title}
                className="w-16 h-20 object-cover rounded"
              />
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p>Quantity: {item.quantity}</p>
                <p>Price: {item.price}</p>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item._id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={clearCart}
          className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Clear Cart
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--bc-accent)]"
        >
          Proceed to Order
        </button>
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

export default CartPage;
