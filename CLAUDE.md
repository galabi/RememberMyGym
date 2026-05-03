# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**RememberMyGym** is a fitness tracking web app with an AI workout planner. It is a monorepo containing a Node.js/Express REST API (`Backend/`) and a React SPA (`frontend/`).

## Development Commands

### Backend
```bash
cd Backend
npm start        # Start Express server (port from .env PORT, default 3000)
npm test         # Run Jest test suite
npm run test:watch  # Run Jest in watch mode
```

### Frontend
```bash
cd frontend
npm start        # Start React dev server (port 3000 — change if backend is on 3000)
npm run build    # Production build
npm test         # Run React test suite
```

### Root-Level Tests
```bash
npm test         # Runs Jest against Backend/__tests__/**/*.test.js
```

> Note: `npm start` at the root is broken (references a non-existent `index.js`). Always start backend and frontend from their own directories.

### Running a Single Test File
```bash
npx jest Backend/__tests__/auth.test.js --detectOpenHandles
```

## Environment Variables

**Backend** (`Backend/.env`):
- `PORT` — server port
- `JWT_SECRET` — used to sign/verify JWTs
- `MONGO_URI` — MongoDB Atlas connection string
- `API_IP` — IP the server binds to (also used for CORS)
- `GEMINI_API_KEY` — Google Gemini API key for AI plan generation

**Frontend** (`frontend/.env`):
- `REACT_APP_API_BASE_URL` — base URL for Axios calls (e.g. `http://192.168.68.53:3000`)

## Architecture

### Authentication
- Register/login via `POST /api/users/register` and `/login` → returns a 7-day JWT.
- Frontend stores the token in a cookie (`auth_token` via js-cookie).
- Axios global interceptor in `frontend/src/App.js` attaches `Authorization: Bearer <token>` to every request.
- All backend routes are protected by `Backend/middleware/auth.js` except: `POST /login`, `POST /register`, `GET /api/health`.

### Backend (`Backend/`)
- Entry point: `server.js` — registers routes, CORS, and the `protect` middleware.
- `config/database.js` — connects to MongoDB Atlas and tracks connection state (`connected` / `disconnected` / `error`).
- `models/` — Mongoose schemas: `User`, `Workout`, `Measurement`, `WorkoutPlan`.
- `routes/` — one file per domain: `userRoutes`, `workoutRoutes`, `measurementRoutes`, `exerciseRoutes`, `workoutPlanerRoutes`.
- `__tests__/` — Jest + Supertest integration tests (8 files, 15 s timeout).

### Frontend (`frontend/src/`)
- Entry point: `App.js` — holds the Axios interceptor, auth state, route switching, and the health-check poll (every 30 s against `GET /api/health`).
- Components are organized by feature: `auth/`, `dashboard/`, `workout/`, `settings/`, `shared/`.
- `_legacy/` contains deprecated components — do not use them.
- Charts: Recharts. Styling: styled-components + plain CSS.

### AI Workout Planner
- `Backend/routes/workoutPlanerRoutes.js` calls the Google Gemini API with user parameters (age, gender, duration, target area, environment) and returns a structured JSON plan (exercises with sets/reps/bodyPart).
- Plans can be saved to MongoDB via `WorkoutPlan` model and retrieved/deleted per user.

### Health Check Banner
- Frontend polls `GET /api/health` every 30 s.
- Red banner = server unreachable (503); orange banner = server up but DB disconnected.
- Logic lives in `App.js`.
