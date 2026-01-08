# Judix Developer Intern Assignment – Full Stack Application

## 📌 Project Overview

This project is a **Full-Stack Task Management Dashboard** developed as part of the **Judix Developer Intern assignment**.

The goal of this assignment is to demonstrate:
- Frontend development using React
- Backend API development using Node.js and Express
- Secure authentication using JWT
- Database integration with MongoDB
- Clean code structure
- Search, filter, and CRUD functionality
- Proper documentation and scalability awareness

This application allows users to securely register, log in, view their profile, and manage tasks through a protected dashboard.

---

## 🛠 Technology Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt.js

---

## ✨ Features Implemented

### 🔐 Authentication
- User signup with secure password hashing
- User login with JWT-based authentication
- Protected routes (dashboard accessible only after login)
- Logout functionality
- JWT stored securely on client side

### 👤 User Profile
- Profile data fetched from backend
- Displays user name, email, role title, and bio
- Backend-driven profile (no hardcoded frontend data)

### 📋 Dashboard & Task Management
- Create tasks
- View all tasks for logged-in user
- Delete tasks
- Search tasks by title
- Filter tasks by status (pending / completed)
- Real-time updates after actions

### 🔒 Security & Best Practices
- Passwords hashed using bcrypt
- JWT authentication middleware
- Authorization headers enforced
- Error handling and input validation
- Clean separation of concerns

---

## 📁 Project Folder Structure

```
judix-Task/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   └── Dashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js installed
- MongoDB running locally

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend will start on: **http://localhost:5000**

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will start on: **http://localhost:3000**

### Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/judix_task
JWT_SECRET=judix_secret_key
```

---

## 📡 API Documentation

### Authentication APIs

#### Signup
**POST** `/api/auth/signup`

```json
{
  "name": "Test User",
  "email": "testuser@gmail.com",
  "password": "password123"
}
```

#### Login
**POST** `/api/auth/login`

```json
{
  "email": "testuser@gmail.com",
  "password": "password123"
}
```

#### Get User Profile
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

### Task APIs (JWT Protected)

#### Create Task
**POST** `/api/tasks`

```json
{
  "title": "Learn Express",
  "description": "Build CRUD APIs"
}
```

#### Get Tasks
**GET** `/api/tasks`

**Query Parameters:**
- `search` – search by title
- `status` – pending / completed

**Example:**
```
/api/tasks?search=learn&status=pending
```

#### Delete Task
**DELETE** `/api/tasks/:id`

---

## 🚀 Scalability & Architecture Considerations

If this application were to scale further:

- Frontend and backend can be deployed independently
- APIs are modular and easy to extend
- JWT middleware ensures secure access
- MongoDB indexing can improve search performance
- Pagination can be added for large datasets
- Backend can be scaled using cloud infrastructure and load balancers

---

## 📝 Notes

This project demonstrates a complete understanding of full-stack development principles, from secure authentication to database operations and clean API design. The architecture follows industry best practices and is designed with scalability in mind.