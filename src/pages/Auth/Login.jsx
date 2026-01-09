import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import SocialLogin from "./SocialLogin";
import { useForm } from "react-hook-form";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

const API = "https://book-courier-server-iota.vercel.app";

const Login = () => {
  const { register, formState: { errors } } = useForm();
  const { signInUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

    const syncUserToDB = async (firebaseUser) => {
    const token = await firebaseUser.getIdToken(true);

    await fetch(`${API}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: firebaseUser.displayName || "",
      }),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const firebaseUser = await signInUser(email, password);
      await syncUserToDB(firebaseUser);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-(--bc-bg) px-4 py-10">

      <div className="bg-(--bc-surface) shadow-xl rounded-xl p-8 w-full max-w-md border border-(--color-secondary)">
        <h2 className="text-3xl font-bold text-center text-(--color-primary) mb-2">
          Welcome Back </h2>
  <p className="text-center text-(--bc-text)/70 mb-6">
          Login to continue your journey</p>

        {/* Error */}
        {error && (
          <p className="text-(--bc-accent) text-sm text-center mb-4 font-medium">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text text-(--bc-text)">Email</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              {...register("email", { required: "Email is required" })}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full text-(--bc-text) border-(--color-secondary) focus:border-(--color-primary)"
            />
            {errors.email && (
              <p className="text-(--bc-accent) text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <label className="label">
              <span className="label-text text-(--bc-text)">Password</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full pr-10 text-(--bc-text) border-(--color-secondary) focus:border-(--color-primary)"
            />

            {/* Toggle Icon */}
            <button
              type="button"
              className="absolute inset-y-10 right-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaRegEyeSlash className="h-5 w-5 text-gray-500" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {errors.password && (
              <p className="text-(--bc-accent) text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-(--color-primary) hover:bg-[#5d432c] text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-4 w-full">
          <SocialLogin />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-(--bc-text)/80">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-(--color-primary) font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
