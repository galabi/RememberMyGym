# RememberMyGym

A full-stack fitness tracking web app with AI-powered workout plan generation. Log exercises, track body measurements, and get personalized workout plans built around your schedule and goals.

## Features

- **Workout Logging** — Track exercises with weight, sets, and reps. View your most recent records per exercise grouped by muscle group.
- **Body Measurements** — Log and track weight, height, and body fat percentage over time.
- **AI Workout Planner** — Generate personalized workout plans via Google Gemini based on your age, gender, available time, target area, and environment (home or gym).
- **Progress Charts** — Visualize your performance history with interactive graphs.
- **User Accounts** — Secure registration and login with cookie-based session persistence.

## Tech Stack

**Frontend**
- React 19
- Styled Components
- Recharts (data visualization)
- Axios

**Backend**
- Node.js + Express 5
- MongoDB Atlas + Mongoose
- Google Gemini API (AI workout generation)
- Zod (schema validation)
- bcrypt (password hashing)

## Project Structure

```
RememberMyGym/
├── Backend/
│   ├── models/          # Mongoose schemas (User, Workout, Measurement, WorkoutPlan)
│   ├── routes/          # Express route handlers
│   ├── __tests__/       # Jest + Supertest test suite
│   ├── server.js        # Express app setup
│   └── DataBase.js      # MongoDB connection
├── frontend/
│   └── src/
│       └── components/  # React components
└── TESTING.md           # Testing documentation
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

# Create a .env file in the root
PORT=3000
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key

# Start the server
npm start
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create a .env file in frontend/
REACT_APP_API_BASE_URL=http://localhost:3000

# Start the dev server
npm start
```

## API Overview

| Route | Description |
|---|---|
| `POST /api/users/register` | Register a new user |
| `POST /api/users/login` | Login |
| `POST /api/workouts/log` | Log a workout set |
| `GET /api/workouts/last/:userId` | Get latest record per exercise |
| `POST /api/measurements/log` | Log body measurements |
| `GET /api/measurements/history/:userId` | Get measurement history |
| `POST /api/planer/generate` | Generate an AI workout plan |
| `POST /api/planer/save` | Save a workout plan |

