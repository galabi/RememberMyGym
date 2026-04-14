# RememberMyGym

A full-stack fitness tracking web app with AI-powered workout plan generation. Log exercises, track body measurements, and get personalized workout plans built around your schedule and goals.

## Features

- **Workout Logging** — Track exercises with weight, sets, and reps. View your most recent records per exercise grouped by muscle group.
- **AI Workout Planner** — Generate personalized workout plans via Google Gemini based on your age, gender, available time, target area, and environment. Save plans and add their exercises directly to your dashboard.
- **Saved Plans** — Browse and manage your previously generated workout plans.
- **Body Measurements** — Log and track weight, height, and body fat percentage over time.
- **Progress Charts** — Visualize your performance history with interactive graphs.
- **User Accounts** — Registration, login, and profile management (username, personal info, password).
- **JWT Authentication** — All API routes are protected with JSON Web Tokens.
- **Server & DB Status** — Live banner alerts when the server is unreachable or the database has connection issues.

## Tech Stack

**Frontend**
- React 19
- Axios (with global JWT interceptor)
- Recharts (data visualization)
- js-cookie

**Backend**
- Node.js + Express 5
- MongoDB Atlas + Mongoose
- Google Gemini API (AI workout generation)
- JSON Web Tokens (jsonwebtoken)
- bcrypt (password hashing)
- Zod (schema validation)

## Project Structure

```
RememberMyGym/
├── Backend/
│   ├── config/
│   │   └── database.js       # MongoDB connection + status tracking
│   ├── middleware/
│   │   └── auth.js           # JWT protect middleware
│   ├── models/               # Mongoose schemas (User, Workout, Measurement, WorkoutPlan)
│   ├── routes/               # Express route handlers
│   ├── __tests__/            # Jest + Supertest test suite
│   └── server.js             # Express app entry point
└── frontend/
    └── src/
        ├── components/
        │   ├── auth/         # Login, SignUp, UserDetails
        │   ├── dashboard/    # Dashboard, ExerciseSelector, GraphModal, MeasurementTracker
        │   ├── workout/      # WorkoutPlaner, WorkoutTypes
        │   ├── settings/     # Settings, PasswordChange, UsernameChange, PersonalInfo
        │   └── shared/       # Toolbar
        ├── workout_icons/    # Muscle group PNG icons
        └── App.js
```

## Getting Started

### Prerequisites

- Node.js
- A MongoDB Atlas cluster
- A Google Gemini API key

### Backend

```bash
# Install dependencies
npm install

# Create Backend/.env
PORT=3000
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_random_secret_key
API_IP=localhost
REACT_APP_API_BASE_URL=http://localhost:3000

# Start the server
npm start
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create frontend/.env
REACT_APP_API_BASE_URL=http://localhost:3000

# Start the dev server
npm start
```

## API Overview

All routes except `/api/users/login`, `/api/users/register`, and `/api/health` require a `Authorization: Bearer <token>` header.

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/health` | ✗ | Server & database status |
| `POST` | `/api/users/register` | ✗ | Register a new user |
| `POST` | `/api/users/login` | ✗ | Login and receive JWT |
| `GET` | `/api/users/profile/:id` | ✓ | Get user profile info |
| `PATCH` | `/api/users/update/username/:id` | ✓ | Update username |
| `PATCH` | `/api/users/update/password` | ✓ | Update password |
| `POST` | `/api/workouts/log` | ✓ | Log a workout set |
| `GET` | `/api/workouts/last/:userId` | ✓ | Get latest record per exercise |
| `POST` | `/api/measurements/log` | ✓ | Log body measurements |
| `GET` | `/api/measurements/history/:userId` | ✓ | Get measurement history |
| `POST` | `/api/exercises/add` | ✓ | Add exercise to user list |
| `POST` | `/api/exercises/addPlan` | ✓ | Bulk add exercises from a plan |
| `POST` | `/api/planer/generate` | ✓ | Generate an AI workout plan |
| `POST` | `/api/planer/save` | ✓ | Save a workout plan |
| `GET` | `/api/planer/:userId` | ✓ | Get all saved plans |
| `DELETE` | `/api/planer/:userId/:workoutIndex` | ✓ | Delete a saved plan |
