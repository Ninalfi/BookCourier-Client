import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AddBook = () => {
     const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

      const book = {
      title: e.target.title.value,
      author: e.target.author.value,
      image: e.target.img.value,
      price: Number(e.target.price.value),
      status: e.target.status.value,
      librarianEmail: user.email
    };
     try {
      await axiosSecure.post("/books", book);
      setMessage("Book added successfully!");
      e.target.reset();
    } catch (err) {
      console.error(err);
      setMessage("Error adding book.");
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="p-6 bg-white max-w-md">
      <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="title" placeholder="Book Title" required className="input" />
        <input name="author" placeholder="Author Name" required className="input" />
        <input name="image" placeholder="Image URL" required className="input" />
        <input name="price" type="number" placeholder="Price" required className="input" />
        <select name="status" className="input">
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Adding..." : "Add Book"}
        </button>
         </form>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
};

export default AddBook;