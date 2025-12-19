import React from "react";
import { useCart } from "../contexts/CartContext";


const CartPage = () => {
  const { cart, totalItems, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) return <p className="text-center py-10">Your cart is empty</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart ({totalItems} items)</h1>
      <ul className="flex flex-col gap-4">
        {cart.map((item) => (
          <li key={item._id} className="flex justify-between items-center border p-4 rounded">
            <div className="flex items-center gap-4">
              <img src={item.img} alt={item.title} className="w-16 h-20 object-cover rounded" />
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
          onClick={() => alert("Proceed to order")}
          className="px-6 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--bc-accent)]"
        >
          Proceed to Order
        </button>
      </div>
    </div>
  );
};

export default CartPage;
