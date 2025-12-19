import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === book._id);
      if (existing) {
        return prev.map((item) =>
          item._id === book._id
            ? { ...item, quantity: item.quantity + book.quantity }
            : item
        );
      } else {
        return [...prev, book]; // add new book
      }
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter((item) => item._id !== bookId));
  };

  const clearCart = () => setCart([]);
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
