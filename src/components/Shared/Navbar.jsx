import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";

import {
  FaSun, FaMoon, FaHome, FaBook, FaTachometerAlt, FaMapMarkedAlt,
  FaPhoneAlt, FaEnvelope, FaClock, FaComments, FaHeart, FaShoppingCart, FaBars
} from "react-icons/fa";
import Logo from "./Logo";
import { useAuth } from "../../contexts/AuthProvider";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [theme, setTheme] = useState("light");
   const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  const handleThemeToggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const links = (
    <>
      <li><NavLink to="/" className="flex items-center gap-1"><FaHome /> Home</NavLink></li>
      <li><NavLink to="/books" className="flex items-center gap-1"><FaBook /> Books</NavLink></li>
      <li><NavLink to="/dashboard" className="flex items-center gap-1"><FaTachometerAlt /> Dashboard</NavLink></li>
      <li><NavLink to="/coverage" className="flex items-center gap-1"><FaMapMarkedAlt /> Coverage</NavLink></li>
    </>
  );

  return (
    <div className="w-full shadow-md">

      <div className="bg-(--color-primary) text-(--bc-surface) text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <FaPhoneAlt /> +880 1234 567890
            </span>

            <span className="flex items-center gap-1">
              <FaEnvelope /> book_courier@gmail.com
            </span>

            <span className="hidden md:flex items-center gap-1">
              <FaClock /> Sat – Fri: 7 AM – 11 PM
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 cursor-pointer">
              <FaComments /> Live Chat
            </span>
          </div>

        </div>
      </div>

      {/* ====== MAIN NAVBAR ====== */}
      <div className="bg-(--bc-bg) py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center text-2xl font-bold text-(--bc-text)">
            <Logo />
            <span className="ml-2">BookCourier</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex menu menu-horizontal gap-6 text-(--bc-text) font-medium">
            {links}
          </ul>

          {/* Right side actions */}
          <div className="flex items-center gap-4">

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="btn btn-circle border bg-(--bc-surface) text-(--bc-text)"
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            {/* Wishlist */}
            <div className="relative p-3 border rounded-full border-(--color-primary)">
              <FaHeart className="text-(--color-primary)" />
              <span className="absolute top-0 right-0 bg-(--bc-accent) text-white rounded-full px-1 text-xs">
                0
              </span>
            </div>

            {/* Cart */}
            <div className="relative p-3 border rounded-full border-(--color-primary)">
              <FaShoppingCart className="text-(--color-primary)" />
              <span className="absolute top-0 right-0 bg-(--bc-accent) text-white rounded-full px-1 text-xs">
                0
              </span>
            </div>
            {/* auth */}
            <div>
                 {!user ? (
            <div className="flex gap-4">
              <NavLink to="/login" className="btn-outline">Login</NavLink>
              <NavLink to="/register" className="btn-primary">Register</NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative group">
                <img
                  src={user?.photoURL}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full border cursor-pointer"
                />
                <span className="absolute hidden group-hover:block bg-black text-white text-sm px-2 py-1 rounded-md -bottom-10 left-1/2 transform -translate-x-1/2">
                  {user?.displayName}
                </span>
              </div>
            <button 
            className="btn-outline" 
            onClick={() => {
                logOut()
                .then(() => {
                    console.log("Logged out successfully");
                })
                .catch(err => console.error(err));
            }}
            >
        Logout
        </button>
            </div>
          )}
        </div>
            </div>

            {/* Mobile Toggle */}
            {menuOpen && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 flex flex-col gap-3 md:hidden">

          {links}
            <ThemeToggle></ThemeToggle>

          {!user ? (
            <>
              <NavLink to="/login" className="btn-outline">Login</NavLink>
              <NavLink to="/register" className="btn-primary">Register</NavLink>
            </>
          ) : (
            <>
              <div className="flex gap-3 items-center">
                <img src={user?.photoURL} className="w-10 h-10 rounded-full border" />
                <p>{user?.displayName}</p>
              </div>
              <button className="btn-outline" onClick={logOut}>Logout</button>
            </>
          )}
        </div>
      )}

          </div>
        </div>
      </div>

  );
};

export default Navbar;
