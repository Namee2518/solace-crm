# Solace CRM — Full-Stack CRM Web Application

A full-stack CRM web application built for the Alphagnito Round 1 Technical Assessment. It provides user authentication (Register/Login with JWT) and a protected Agent Dashboard with full CRUD operations, backed by a MySQL database.

## Features

- **Register / Login** with JWT-based authentication and bcrypt password hashing
- **Protected Agent Dashboard** — unauthenticated users are redirected to Login
- **Agent CRUD** — Create, Read, Update, Delete agents via a modal-driven UI, with a confirmation prompt before delete
- **Client-side & server-side validation** — required fields, email format, password match, unique email
- **RESTful API** with proper HTTP status codes and descriptive error messages
- **Responsive UI** built with React + Bootstrap 5

## Tech Stack

| Layer          | Technology                                |
|----------------|--------------------------------------------|
| Frontend       | React JS (Vite), HTML, CSS, Bootstrap 5    |
| Backend        | Node.js, Express.js                        |
| Database       | MySQL                                      |
| Authentication | JWT (jsonwebtoken), bcryptjs               |

## Project Structure

```
CRM Web Application/
├── backend/            # Express REST API
│   ├── config/         # MySQL connection pool
│   ├── controllers/    # Route handler logic (auth, agents)
│   ├── middleware/      # JWT auth middleware
│   ├── routes/          # Express routers
│   ├── database/        # schema.sql (DB setup script)
│   └── server.js        # App entry point
└── frontend/            # React (Vite) SPA
    └── src/
        ├── api/          # Axios instance with JWT interceptor
        ├── components/   # Navbar, ProtectedRoute, modals
        ├── context/      # AuthContext (auth state)
        └── pages/        # Login, Register, Dashboard
```

## Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- MySQL Server (running locally)

### 1. Database Setup

Run the setup script to create the database and tables:

```bash
mysql -u root -p < backend/database/schema.sql
```

This creates the `crm_db` database with `users` and `agents` tables.

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in your MySQL credentials and a JWT secret (see [Environment Variables](#environment-variables) below).

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`.

### 4. Using the App

1. Open `http://localhost:5173`
2. Register a new account
3. Log in
4. Manage agents from the Dashboard (Create / Edit / Delete)

## Database Schema

**users**

| Column         | Type          | Notes                  |
|----------------|---------------|-------------------------|
| id             | INT, PK, AI   |                          |
| full_name      | VARCHAR(100)  | NOT NULL                |
| email          | VARCHAR(150)  | UNIQUE, NOT NULL        |
| mobile_number  | VARCHAR(20)   | NOT NULL                |
| password       | VARCHAR(255)  | bcrypt hash, NOT NULL   |
| created_at     | TIMESTAMP     | default CURRENT_TIMESTAMP |

**agents**

| Column       | Type                        | Notes                          |
|--------------|-----------------------------|----------------------------------|
| id           | INT, PK, AI                 |                                   |
| name         | VARCHAR(100)                | NOT NULL                         |
| email        | VARCHAR(150)                | NOT NULL                         |
| phone        | VARCHAR(20)                 | NOT NULL                         |
| status       | ENUM('Active','Inactive')   | default 'Active'                 |
| created_by   | INT                         | FK → users(id), ON DELETE CASCADE |
| created_at   | TIMESTAMP                   | default CURRENT_TIMESTAMP        |

See [backend/database/schema.sql](backend/database/schema.sql) for the full script.

## API Endpoint Documentation

Base URL: `http://localhost:5000/api`

### Auth Routes (`/api/auth`)

| Method | Route        | Auth required | Request Body                                                                 | Response                                      |
|--------|-------------|----------------|--------------------------------------------------------------------------------|------------------------------------------------|
| POST   | `/register` | No             | `{ fullName, email, mobileNumber, password, confirmPassword }`                | `201` `{ message }`                            |
| POST   | `/login`    | No             | `{ email, password }`                                                          | `200` `{ message, token, user }`                |
| POST   | `/logout`   | No             | —                                                                               | `200` `{ message }`                             |

### Agent Routes (`/api/agents`) — all require `Authorization: Bearer <token>`

| Method | Route        | Request Body                                   | Response                       |
|--------|-------------|--------------------------------------------------|----------------------------------|
| GET    | `/`         | —                                                 | `200` `[ agent, ... ]`            |
| POST   | `/`         | `{ name, email, phone, status }`                 | `201` `agent`                     |
| PUT    | `/:id`      | `{ name, email, phone, status }`                 | `200` `agent`                     |
| DELETE | `/:id`      | —                                                 | `200` `{ message }`               |

**Error responses** follow the shape `{ message: string }` with appropriate status codes: `400` (validation), `401` (auth), `404` (not found), `409` (duplicate email), `500` (server error).

## Environment Variables

### `backend/.env.example`
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=crm_db
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=1d
```

### `frontend/.env.example`
```
VITE_API_URL=http://localhost:5000/api
```

Copy each `.env.example` to `.env` and fill in real values before running. `.env` files are git-ignored and never committed.

## Notes

- The Figma design reference required sign-in access that wasn't available during the assessment window; the UI was built to closely follow standard CRM design conventions (split-panel auth screens, card/table-based dashboard) using a consistent blue/navy color palette, spacing, and typography throughout.
- Passwords are hashed with bcrypt before storage; plain-text passwords are never stored or logged.
- All SQL queries use parameterized placeholders (`?`) via `mysql2` to prevent SQL injection.
