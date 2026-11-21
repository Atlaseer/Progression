# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Progression is a fullstack workout tracking application. Users register, log workouts (sets of exercises), and view their history. The repo is a monorepo with three `package.json` files: root, `client/`, and `server/`.

## Commands

Run from the repo root unless noted.

```bash
# Install all dependencies
npm run install-all

# Start both client and server in development
npm run dev

# Start only the server (nodemon, port 5000)
npm run server

# Start only the client (Vite, port 5173)
npm run client

# Lint client code
cd client && npm run lint

# Seed the database
npm run seed-users
npm run seed-exercises
npm run seed-workouts
```

## Environment Variables

**`server/.env`** (required):
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for signing JWTs
- `PORT` — Optional, defaults to 5000
- `NODE_ENV` — Set to `production` to enable secure cookies

**`client/.env`** (required):
- `VITE_SERVER_URL` — Base URL for API calls (e.g. `http://localhost:5000`)

## Architecture

### Client (`client/src/`)
- React 19 + React Router v7 + Vite
- **`main.jsx`** wraps the app in `<AuthProvider>` (from `Components/AuthContext.jsx`)
- **`AuthContext`** manages global auth state; calls `/api/auth/me` on mount to restore session from httpOnly JWT cookie. Exposes `{ user, login, logout, loading, isAdmin, isActive }` via `useAuth()` hook.
- All API calls use `axios` with `withCredentials: true` and the `VITE_SERVER_URL` env var as the base.
- Pages live in `pages/`, shared UI in `Components/`, CSS in `styles/`.

### Server (`server/`)
- Express 5 + Mongoose + MongoDB; uses ES modules (`import`/`export`) throughout
- Entry point: `index.js` — connects to MongoDB then starts the HTTP server
- Auth middleware: `middleware/auth.js` exports `requireAuth` — reads `token` cookie, verifies JWT, attaches `req.user`
- Route modules (all mounted in `index.js`):
  - `routes/authentication.js` → `/api/auth` (login, logout, `/me`)
  - `routes/user.js` → `/api/users/` (CRUD for users)
  - `routes/exercise.js` → `/api/exercises` (CRUD; no auth required)
  - `routes/workout.js` → `/api/workouts` (CRUD; protected by `requireAuth`; owner-only writes)
  - `routes/set.js` — exists but is **not mounted** in `index.js`
- File uploads handled by `multer`; static files served from `uploads/`

### Client routes (`client/src/App.jsx`)
- `/` → HomePage, `/about` → AboutPage, `/login` → LoginPage, `/signup` → RegisterUserPage
- `/profile/:username` → ProfilePage
- `/workouts` → ViewWorkoutsPage, `/workouts/new` → RegisterWorkoutPage
- `/exercises` → ViewExercisesPage
- Banned users (`isActive === false`) bypass routing and always see `BannedPage`

### Data Model
- `User`: username, email, password (bcrypt), firstName, lastName, isAdmin, isActive, bio
- `Workout`: ref to User + embedded `sets` array + optional `startTime`/`endTime`/`createdAt`
- `Set` (embedded in Workout): ref to Exercise + reps, duration, distance, weight, rest. `Set.js` exports both the mongoose model (`Set`) and the raw `setSchema` used for embedding.
- `Exercise`: standalone collection (seeded via `seeds/SeedExercise.js`); fields: name, muscleGroup, equipment, description, pictureUrl
