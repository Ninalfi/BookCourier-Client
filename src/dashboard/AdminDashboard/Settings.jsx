import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCog,
  FaUserShield,
  FaMoon,
  FaSun,
  FaCopy,
  FaSignOutAlt,
  FaSave,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthProvider";

const DEFAULT_AVATAR = "https://i.ibb.co/ZYW3VTp/brown-brim.png";

export default function Settings() {
  const { user, updateUserProfile, logOut } = useAuth();

  const API = useMemo(
    () => import.meta.env.VITE_API_URL || "https://book-courier-server-iota.vercel.app",
    []
  );

  const [loading, setLoading] = useState(false);

  // theme
  const [theme, setTheme] = useState("light");

  // profile
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  useEffect(() => {
    // load theme
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    // when user changes (login / refresh)
    setName(user?.displayName || "");
    setPhotoURL(user?.photoURL || "");
  }, [user]);

  const applyTheme = (next) => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
    setTheme(next);
    localStorage.setItem("theme", next);
    toast.success(`Theme set to ${next}`);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Copy failed");
    }
  };

  const onSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login");

    const cleanName = String(name || "").trim();
    const cleanPhoto = String(photoURL || "").trim();

    if (!cleanName) return toast.error("Name is required");

    // optional URL check (only if user typed something)
    if (cleanPhoto) {
      try {
        // will throw if invalid URL
        new URL(cleanPhoto);
      } catch {
        return toast.error("Photo URL is not valid");
      }
    }

    try {
      setLoading(true);
      await updateUserProfile(cleanName, cleanPhoto);
      toast.success("Profile updated!");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logOut();
      toast.success("Logged out");
    } catch (err) {
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <FaCog /> Admin Settings
            </h1>
            <p className="mt-2 text-base-content/70">
              Manage admin preferences, profile details, and system settings.
            </p>
          </div>

          <div className="badge badge-outline badge-primary rounded-xl px-4 py-3">
            <FaUserShield className="mr-2" /> Admin
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md">
          <h2 className="text-lg font-semibold">Admin Profile</h2>

          <div className="mt-4 flex items-center gap-4">
            <img
              src={user?.photoURL || DEFAULT_AVATAR}
              onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
              alt="Admin"
              className="w-16 h-16 rounded-full border object-cover"
            />
            <div>
              <div className="font-semibold">{user?.displayName || "—"}</div>
              <div className="text-sm text-base-content/70">{user?.email || "—"}</div>
            </div>
          </div>

          <form onSubmit={onSaveProfile} className="mt-6 space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Display Name</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full rounded-xl"
                placeholder="Admin name"
                disabled={loading}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Photo URL</span>
              </label>
              <input
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="input input-bordered w-full rounded-xl"
                placeholder="https://..."
                disabled={loading}
              />
              <p className="mt-2 text-xs text-base-content/60">
                Paste an image URL. Leave empty to keep default avatar.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary rounded-xl w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Profile
                </>
              )}
            </button>
          </form>
        </div>

        {/* Middle: Preferences */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md lg:col-span-2">
          <h2 className="text-lg font-semibold">Preferences</h2>

          {/* Theme */}
          <div className="mt-5 rounded-2xl border border-base-300 bg-base-200/40 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">Theme</div>
                <div className="text-sm text-base-content/70">
                  Choose how your dashboard looks.
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => applyTheme("light")}
                  className={`btn btn-sm rounded-xl ${
                    theme === "light" ? "btn-primary" : "btn-outline"
                  }`}
                  disabled={loading}
                >
                  <FaSun /> Light
                </button>
                <button
                  type="button"
                  onClick={() => applyTheme("dark")}
                  className={`btn btn-sm rounded-xl ${
                    theme === "dark" ? "btn-primary" : "btn-outline"
                  }`}
                  disabled={loading}
                >
                  <FaMoon /> Dark
                </button>
              </div>
            </div>
          </div>

          {/* API */}
          <div className="mt-4 rounded-2xl border border-base-300 bg-base-200/40 p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="font-semibold">API Base URL</div>
                <div className="text-sm text-base-content/70">
                  Used by the dashboard for requests.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-xl border border-base-300 bg-base-100 px-4 py-2 text-sm">
                  {API}
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm rounded-xl"
                  onClick={() => copyText(API)}
                >
                  <FaCopy /> Copy
                </button>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="mt-6 rounded-2xl border border-error/40 bg-error/5 p-5">
            <div className="font-semibold text-error">Danger zone</div>
            <div className="text-sm text-base-content/70 mt-1">
              Admin security actions.
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                className="btn btn-outline btn-sm rounded-xl border-error text-error hover:bg-error hover:text-white"
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Working...
                  </>
                ) : (
                  <>
                    <FaSignOutAlt /> Logout
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="mt-4 text-xs text-base-content/60">
            Tip: Keep admin profile updated for audits and support.
          </p>
        </div>
      </div>
    </div>
  );
}