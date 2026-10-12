# HabHeat 🌱

**Small habits. Meaningful progress.**

HabHeat is a full-stack habit and task tracking application designed to help users build consistency, organise their daily responsibilities, and visualise their progress over time.

It combines habit tracking, task management, daily productivity statistics, and a completion heatmap in a clean, distraction-free interface.

## ✨ Features

### 🔐 Authentication & Profile
- User registration and login.
- Secure authentication using JWTs stored in HTTP-only cookies.
- Protected routes for authenticated users.
- Profile management, including name and email updates.
- Logout functionality.

### 🌱 Habit Tracking
- Create, view, update, and delete habits.
- Track habit completion by date.
- Visualise consistency through a GitHub-style completion heatmap.
- Monitor active habits and daily completion progress.

### ✅ Task Management
- Create, view, update, and delete tasks.
- Organise daily responsibilities.
- Mark tasks as completed or incomplete.
- Track remaining tasks and daily progress.

### 📊 Productivity Dashboard
- Overview of active habits.
- Daily habit completion statistics.
- Today's task summary.
- Overall daily progress.
- Quick access to habits and tasks.

### 🎨 User Interface
- Dark and light themes.
- Responsive layouts for desktop and mobile.
- Reusable UI components.
- A minimal interface focused on consistency and productivity.

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- Lucide icons

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt-based password hashing
- Zod for validation

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

## 📁 Project Structure

```text
habheat/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the repository

```bash
git clone https://github.com/aaryaishaan/habheat.git
cd habheat
```

### 2. Set up the backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` and configure the required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
```

Use your actual MongoDB connection string and a strong, randomly generated JWT secret. Never commit your `.env` file to Git.

Build and start the backend:

```bash
npm run build
npm start
```

The backend should be available at:

`http://localhost:5000`

If your backend provides a development script, you can use it instead of building and starting manually.

### 3. Set up the frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The frontend should be available at:

`http://localhost:5173`

### 4. Verify the connection

Open the frontend URL in your browser, register an account, and test the authentication, habit, and task features.

Ensure MongoDB is running or accessible through MongoDB Atlas before testing database-dependent operations.

## 🔑 Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | Port used by the backend server; Render supplies its own port in production. |
| `MONGO_URI` | MongoDB connection string. |
| `JWT_SECRET` | Secret used to sign and verify JWTs. |
| `FRONTEND_URL` | Allowed frontend origin for credentialed CORS requests. |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API. |

**Security notes:**
- Never expose `MONGO_URI` or `JWT_SECRET` in frontend code.
- Variables prefixed with `VITE_` are exposed to browser-side code.
- Use HTTPS and appropriate cookie settings in production.
- Keep environment files and other secrets out of version control.

## 🔌 API Overview

The backend exposes REST API endpoints for authentication, habits, and tasks.

### Authentication — `/api/auth`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Log in |
| POST | `/logout` | Log out |
| GET | `/me` | Retrieve the authenticated user |
| PATCH | `/update` | Update profile information |

The authentication endpoints are mounted under `/api/auth`.

### Habits — `/api/habits`

The habits API supports creating, retrieving, updating, and deleting habits, along with tracking habit completion.

Typical operations include:

- `GET /api/habits`
- `POST /api/habits`
- `GET /api/habits/:id`
- `PATCH /api/habits/:id`
- `DELETE /api/habits/:id`
- `PATCH /api/habits/:id/toggle`

### Tasks — `/api/tasks`

The tasks API supports creating, retrieving, updating, and deleting tasks.

- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

Protected endpoints require valid authentication. Check the route definitions for the exact request bodies and response formats.

## 🌐 Live Demo

- **Frontend:** [https://habheat.vercel.app](https://habheat.vercel.app)
- **Backend:** [https://habheat-api.onrender.com](https://habheat-api.onrender.com)

The backend is hosted on Render, and the frontend is deployed on Vercel. The backend connects to MongoDB Atlas for persistent data storage.

Note: Render's free instances may spin down after inactivity, which can cause a delay on the first request.

## 🔒 Authentication & Security

HabHeat uses JWT-based authentication with HTTP-only cookies.

- Passwords are hashed before storage.
- Protected routes validate authentication before allowing access.
- HTTP-only cookies prevent client-side JavaScript from directly reading the authentication token.
- Credentialed requests allow the browser to send authentication cookies to the backend.
- Production CORS and cookie settings must match the deployed frontend and backend origins.

## 🗺️ Future Improvements

Potential improvements include:

- Habit streaks and milestone tracking.
- Weekly and monthly productivity reports.
- Habit reminders and notifications.
- More detailed progress visualisations.
- Improved filtering and sorting for tasks.
- Automated testing and continuous integration.
- Study space for groups, and time tracking (something like ypt)

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes.
5. Open a pull request describing the improvements.

## 📄 License

No license has been specified yet. Add a `LICENSE` file and update this section if you intend to distribute the project under an open-source licence.

---

Built with consistency in mind. 🌱