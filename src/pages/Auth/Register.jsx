import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import SocialLogin from "./SocialLogin";
import { useForm } from "react-hook-form";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

const Register = () => {
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm();
  const { registerUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await registerUser(data.email, data.password);
      
      await updateUserProfile({
        displayName: data.name,
        photoURL: data.photo
      });

      navigate("/");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-(--bc-bg) px-4 py-10">

      <div className="bg-(--bc-surface) shadow-xl rounded-xl p-8 w-full max-w-md border border-(--color-secondary)">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-(--color-primary) mb-2">
          Create an Account
        </h2>

        <p className="text-center text-(--bc-text)/70 mb-6">
          Join BookCourier and start exploring
        </p>

        {/* Error */}
        {error && (
          <p className="text-(--bc-accent) text-sm text-center mb-4 font-medium">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Name */}
          <div>
            <label className="label">
              <span className="label-text text-(--bc-text)">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              {...formRegister("name", { required: "Name is required" })}
              className="input input-bordered w-full text-(--bc-text) border-(--color-secondary) focus:border-(--color-primary)"
            />
            {errors.name && <p className="text-(--bc-accent) text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/**Photo file update */}
          {/* <label className="label">
              <span className="label-text text-(--bc-text)">Upload Photo</span>
            </label>
          <input type="file"{...formRegister('photo',{required:true})} className="file-input file-input-bordered w-full text-(--bc-text) border-(--color-secondary) focus:border-(--color-primary)" />
           {errors.name?.type==='required' && <p className="text-(--bc-accent) text-sm mt-1">Photo is required</p>} */}
           
          {/* Photo URL */}
          <div>
            <label className="label">
              <span className="label-text text-(--bc-text)">Photo URL</span>
            </label>
            <input
              type="text"
              placeholder="https://your-photo.com/profile.jpg"
              {...formRegister("photo")}
              className="input input-bordered w-full text-(--bc-text) border-(--color-secondary) focus:border-(--color-primary)"
            />
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text text-(--bc-text)">Email</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              {...formRegister("email", { required: "Email is required" })}
              className="input input-bordered w-full text-(--bc-text) border-(--color-secondary) focus:border-(--color-primary)"
            />
            {errors.email && <p className="text-(--bc-accent) text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="label">
              <span className="label-text text-(--bc-text)">Password</span>
            </label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter password"
              {...formRegister("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              className="input input-bordered w-full pr-10 text-(--bc-text) border-(--color-secondary) focus:border-(--color-primary)"
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute inset-y-10 right-3"
            >
              <span>{showPass ? <FaRegEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}</span>
            </button>

            {errors.password && (
              <p className="text-(--bc-accent) text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="label">
              <span className="label-text text-(--bc-text)">Confirm Password</span>
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter password"
              {...formRegister("confirmPassword", { required: "Confirm password is required" })}
              className="input input-bordered w-full pr-10 text-(--bc-text) border-(--color-secondary) focus:border-(--color-primary)"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-10 right-3"
            >
              {showConfirm ? <FaRegEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
            </button>

            {errors.confirmPassword && (
              <p className="text-(--bc-accent) text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-(--color-primary) hover:bg-[#5d432c] text-white py-2 rounded-lg font-semibold transition"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-(--bc-text)/80">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-(--color-primary) font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
