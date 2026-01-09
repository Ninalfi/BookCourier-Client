###BookCourier – Library-to-Home Delivery System

##🚀Project Overview

BookCourier is a library delivery management system designed to help students, researchers, and readers borrow and return books without physically visiting the library. Users can request book pickup or delivery from nearby libraries, making reading more accessible and convenient.

This project includes features for general users, librarians, and admins with a modern and responsive design, ensuring smooth navigation and a professional interface.

##🌐 Live URL:

Client: https://book-courier-9e429.web.app
Server: https://book-courier-server-iota.vercel.app/

##✨ Purpose
The primary purpose of BookCourier is to revolutionize the book borrowing process by offering a seamless, end-to-end delivery service. It serves three main user roles—Reader, Librarian, and Admin—with tailored dashboards to manage orders, inventory, and users efficiently.

##🔑 Key Features
💻 Core Functionality

### 🔐 Authentication & Authorization
- Firebase Authentication (ID Token verification)
- Role-based access control:
  - **User** – browse books, place orders, wishlist, reviews
  - **Librarian** – manage own books & orders
  - **Admin** – manage users, books, roles

### 👤 User Management
- Auto user creation on first login
- Fetch current logged-in user (`/users/me`)
- Admin-only user list & role update

### 📚 Book Management
- Add / update / delete books (Admin & Librarian)
- Public book listing with:
  - Pagination
  - Search
  - Price sorting
- Book status control (published / unpublished)

### 🛒 Orders System
- Place orders
- Cancel pending orders
- Librarian order management
- Order status updates

### ❤️ Wishlist
- Add/remove books to wishlist
- Prevent duplicate wishlist entries

### ⭐ Reviews
- Users can review only books they ordered
- Review eligibility check

### 💳 Payments
- Secure payment tracking
- Payment status update per order
- User payment history

---

## 🛠️ Technologies Used

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (Native MongoDB Driver)
- **Firebase Admin SDK** (Authentication)

### Security & Utilities
- **dotenv** – environment variables
- **cors** – cross-origin requests
- **crypto** – internal utilities
- **nodemon** – development auto-reload

---

## Dependencies:

--npm install react-slick slick-carousel
--npm install leaflet react-leaflet
--npm install framer-motion
--npm install recharts
```bash
express
mongodb
firebase-admin
dotenv
cors
nodemon
crypto
