<![CDATA[<div align="center">

# 🚀 Ethara — Task & Project Management Platform

### A modern, full-stack task and project management application built with the MERN stack.

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About the Project

**Ethara** is a comprehensive task and project management platform designed to streamline team collaboration and boost productivity. It provides an intuitive dashboard where teams can create projects, assign tasks, track progress, and manage employees — all from a single, beautifully crafted interface.

Whether you're a solo developer managing personal projects or a team lead coordinating across departments, Ethara offers the tools you need to stay organized and deliver on time.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Secure user registration & login with JWT-based authentication and bcrypt password hashing |
| 📊 **Dashboard Overview** | At-a-glance view of tasks, projects, and performance metrics with interactive charts (Recharts) |
| 📁 **Project Management** | Create, edit, and manage projects with team member assignment and collaboration |
| ✅ **Task Management** | Full task lifecycle — create, assign, set priority (Low/Medium/High), set due dates, and track status (Todo → In Progress → Completed) |
| 👥 **Employee Directory** | Browse and manage team members with profile pictures and auto-generated Employee IDs |
| 🛡️ **Admin Panel** | Role-based access control with dedicated admin features for user and team management |
| 👤 **User Profiles** | Customizable profiles with photo upload support |
| ❓ **Help Center** | Built-in help page for user guidance and support |
| 📱 **Responsive Design** | Fully responsive UI that works seamlessly on desktop and mobile devices |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library for building interactive user interfaces |
| **Vite 8** | Lightning-fast build tool and dev server |
| **Tailwind CSS 3** | Utility-first CSS framework for rapid styling |
| **React Router v7** | Client-side routing and navigation |
| **TanStack React Query** | Powerful data fetching, caching, and state management |
| **Axios** | HTTP client for API communication |
| **Recharts** | Charting library for dashboard visualizations |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime for server-side logic |
| **Express 5** | Minimal and flexible web application framework |
| **MongoDB** | NoSQL database for flexible data storage |
| **Mongoose 9** | Elegant MongoDB object modeling for Node.js |
| **JWT** | Secure token-based authentication |
| **bcryptjs** | Password hashing and verification |
| **Multer** | Middleware for handling file uploads |
| **CORS** | Cross-Origin Resource Sharing support |

---

## 📂 Project Structure

```
Ethara/
├── backend/
│   ├── config/             # Database configuration
│   │   └── db.js
│   ├── controllers/        # Route handler logic
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/          # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/             # Mongoose data models
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/             # API route definitions
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── uploads/            # User-uploaded files
│   ├── utils/              # Utility functions
│   ├── server.js           # Express app entry point
│   ├── package.json
│   └── .env                # Environment variables (not committed)
│
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, icons, etc.
│   │   ├── components/     # Reusable UI components
│   │   │   └── Layout.jsx
│   │   ├── context/        # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page-level components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── DashboardOverview.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   ├── SingleProjectPage.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── EmployeeList.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── HelpPage.jsx
│   │   ├── services/       # API service functions
│   │   ├── utils/          # Helper utilities
│   │   ├── App.jsx         # Root component with routing
│   │   ├── App.css         # Global styles
│   │   ├── index.css       # Tailwind & base styles
│   │   └── main.jsx        # Application entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** — [MongoDB Atlas (Cloud)](https://www.mongodb.com/atlas) or [Local Installation](https://www.mongodb.com/docs/manual/installation/)
- **Git** — [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Kapil-2005/Task-Manager-frontend.git
   cd Task-Manager-frontend
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

> **Note:** Replace `your_mongodb_connection_string` with your actual MongoDB URI (e.g., from MongoDB Atlas) and `your_jwt_secret_key` with a strong, random string.

### Running the Application

You need to run both the backend and frontend servers simultaneously.

**Terminal 1 — Start the Backend Server:**

```bash
cd backend
npm run dev
```

The backend API will start on `http://localhost:5000`

**Terminal 2 — Start the Frontend Dev Server:**

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

> Open your browser and navigate to `http://localhost:5173` to use the application.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `GET` | `/api/auth/me` | Get current logged-in user profile |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | Get all projects |
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects/:id` | Get a single project |
| `PUT` | `/api/projects/:id` | Update a project |
| `DELETE` | `/api/projects/:id` | Delete a project |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

> **Note:** All project and task endpoints require a valid JWT token in the `Authorization` header.

---

## 🖼️ Screenshots

> _Screenshots coming soon — Run the application locally to explore the full UI!_

<!-- Add your screenshots here:
![Dashboard](./screenshots/dashboard.png)
![Projects](./screenshots/projects.png)
![Tasks](./screenshots/tasks.png)
-->

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [Kapil Sharma](https://github.com/Kapil-2005)**

⭐ Star this repo if you found it helpful!

</div>
]]>