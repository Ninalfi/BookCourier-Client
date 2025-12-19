import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
//import { db } from "../firebase/firebase.init"; 

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = collection("books");
        const booksSnapshot = await getDocs(booksCollection);
        const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(booksList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching books:", err);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading books...</p>
      </div>
    );
  }

  return (
    <section className="py-10 bg-(--bc-bg)">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-(--color-primary) mb-8">
          All Books
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(book => (
            <Link
              to={`/book/${book.id}`}
              key={book.id}
              className="bg-(--bc-surface) rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <img
                src={book.img}
                alt={book.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-(--bc-text)">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.author}</p>
                <p className="text-(--color-primary) font-semibold mt-2">{book.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllBooks;
