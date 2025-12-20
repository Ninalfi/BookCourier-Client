import React from "react";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <Link
        to="/books"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go Back to All Books
      </Link>
    </div>
  );
};

export default NotFound;
