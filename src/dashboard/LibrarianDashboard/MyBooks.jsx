import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const MyBooks = () => {

      const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [books, setBooks] = useState([]);

    useEffect(() => {
    axiosSecure.get("/books").then(res => {
      const myBooks = res.data.filter(b => b.librarianEmail === user.email);
      setBooks(myBooks);
    });
  }, []);

   const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "unpublished" : "published";
    await axiosSecure.patch(`/books/${id}`, { status: newStatus });
    setBooks(prev =>
      prev.map(b => (b._id === id ? { ...b, status: newStatus } : b))
    );
  };

    return (
        <div className="p-6 bg-white">
      <h2 className="text-2xl mb-4">My Books</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Title</th>
            <th>Image</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Toggle Status</th>
          </tr>
        </thead>
        <tbody>
              {books.map(book => (
            <tr key={book._id} className="text-center border-t">
              <td>{book.title}</td>
              <td>
                <img src={book.image} alt={book.title} className="h-20 mx-auto" />
              </td>
              <td>{book.status}</td>
              <td>
                <Link to={`/dashboard/edit-book/${book._id}`} className="btn btn-sm">
                  Edit
                </Link>
              </td>
                <td>
                <button
                  className="btn btn-sm"
                  onClick={() => toggleStatus(book._id, book.status)}
                >
                  {book.status === "published" ? "Unpublish" : "Publish"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
};

export default MyBooks;