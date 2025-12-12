import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
      <li><NavLink to="/" className="flex items-center gap-1 dark:text-(--color-primary) hover:text-[var(--bc-accent)]"><FaHome /> Home</NavLink></li>
      <li><NavLink to="/books" className="flex items-center gap-1 hover:text-(--bc-accent) dark:text-(--color-primary)"><FaBook /> Books</NavLink></li>
      <li><NavLink to="/dashboard" className="flex items-center dark:text-(--color-primary) gap-1 hover:text-(--bc-accent)"><FaTachometerAlt /> Dashboard</NavLink></li>
      <li><NavLink to="/coverage" className="flex items-center dark:text-(--color-primary) gap-1 hover:text-(--bc-accent)"><FaMapMarkedAlt /> Coverage</NavLink></li>
    </>
  );

  return (
    <div className="w-full shadow-md">
    <div className="text-(--bc-surface) text-sm bg-(--color-primary) py-2 px-4 flex justify-between items-center">
        <div className="flex flex-col md:flex-row md:gap-6">
          <span className="flex items-center gap-1"><FaPhoneAlt /> +880 1234 567890</span>
          <span className="flex items-center gap-1"><FaEnvelope /> book_courier@gmail.com</span>
          <span className="hidden md:flex items-center gap-1"><FaClock /> Sat – Fri: 7 AM – 11 PM</span>
        </div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <span className="flex items-center gap-1 cursor-pointer"><FaComments /> Live Chat</span>
        </div>
      </div>

      <div className="bg-(--bc-bg) py-4 px-4 flex justify-between items-center max-w-7xl mx-auto">

        <Link to="/" className="flex items-center text-2xl font-bold text-(--bc-text)">
          <Logo />
        </Link>

        <ul className="hidden lg:flex menu-horizontal gap-6 text-(--bc-text) font-medium">
          {links}
        </ul>

        <div className="flex items-center gap-4">

          <button
            onClick={handleThemeToggle}
            className="btn btn-circle border hidden md:flex bg-(--bc-surface) text-(--bc-text)"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          <div className="relative p-3 border rounded-full border-(--color-primary)">
            <FaHeart className="text-(--color-primary)" />
            <span className="absolute top-0 right-0 bg-(--bc-accent) text-white rounded-full px-1 text-xs">0</span>
          </div>

          <div className="relative p-3 border rounded-full border-(--color-primary)">
            <FaShoppingCart className="text-(--color-primary)" />
            <span className="absolute top-0 right-0 bg-(--bc-accent)text-white rounded-full px-1 text-xs">0</span>
          </div>

          <div className="hidden md:flex">
            {!user ? (
              <div className="flex gap-4">
                <NavLink to="/login" className="btn-outline">Login</NavLink>
                <NavLink to="/register" className="btn-primary">Register</NavLink>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <img src={user?.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full border cursor-pointer" />
                  <span className="absolute hidden group-hover:block bg-black text-white text-sm px-2 py-1 rounded-md -bottom-10 left-1/2 transform -translate-x-1/2">
                    {user?.displayName}
                  </span>
                </div>
                <button 
                  className="btn-outline" 
                  onClick={() => logOut().catch(err => console.error(err))}
                >Logout</button>
              </div>
            )}
          </div>

          <button className="lg:hidden p-3 border rounded-full border-(--color-primary)" onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars className="text-(--color-primary)"/>
          </button>

        </div>
      </div>

      {menuOpen && (
        <div className="bg-(--bc-surface) p-4 flex flex-col gap-3 lg:hidden border-t border-(--color-primary) text-(--bc-primary">
          <ul className="flex flex-col gap-2">{links}</ul>

          <div className="mt-2 flex flex-col gap-2">
            {!user ? (
              <>
                <NavLink to="/login" className="btn-outline w-full dark:text-(--color-primary) text-center">Login</NavLink>
                <NavLink to="/register" className="btn-primary w-full dark:text-(--color-primary) text-center">Register</NavLink>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <img src={user?.photoURL} className="w-10 h-10 rounded-full border" />
                  <p>{user?.displayName}</p>
                </div>
                <button className="btn-outline w-full dark:text-(--color-primary)" onClick={() => logOut()}>Logout</button>
              </>
            )}

            {/* Theme toggle mobile */}
            <button onClick={handleThemeToggle} className="btn btn-circle border bg-(--bc-surface) text-(--bc-text) mt-2">
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Navbar;
