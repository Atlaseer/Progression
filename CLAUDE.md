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
- Express 5 + Mongoose + MongoDB
- Entry point: `index.js` — connects to MongoDB then starts the HTTP server
- Auth: JWT issued on login, stored as an httpOnly cookie (`token`), verified on protected routes
- Route modules:
  - `routes/user.js` → mounted at `/api/users/` (CRUD for users)
  - `routes/authentication.js` → login, logout, `/me` (should be mounted at `/api/auth/`)
  - `routes/set.js` → set-related routes
  - Exercise routes are imported in `index.js` from `routes/exercise.js`
- Models: `User`, `Workout`, `Exercise`, `Set` (Set is an embedded schema inside Workout)
- File uploads handled by `multer`; static files served from `uploads/`

### Data Model
- `User`: username, email, password (bcrypt), firstName, lastName, isAdmin, isActive, bio
- `Workout`: belongs to a User, contains an array of embedded `Set` documents
- `Set`: embedded in Workout, references an Exercise
- `Exercise`: standalone collection (seeded via `SeedExercise.js`)
