# Lucid

A personal game library tracker. Log the games you're playing, completed, paused, dropped, or want to play — with ratings, hours, price, and notes for each entry.

## Features

- Track games across five statuses: Playing, Completed, Paused, Dropped, Wishlist
- Rate games, log hours played, purchase price, and personal notes
- Dashboard with library stats and recent activity
- Secure authentication with email verification and password reset
- Account management: update profile, change password, delete account

## Tech Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Frontend   | React 19, React Router 7, TypeScript, Sass |
| Backend    | Node.js, Express 5, TypeScript             |
| Database   | MongoDB, Mongoose                          |
| Auth       | express-session, bcryptjs                  |
| Email      | Nodemailer                                 |
| Testing    | Vitest, Testing Library                    |
| Deployment | Vercel                                     |

## Project Structure

```text
lucid/
├── client/          # React frontend (Vite)
├── server/          # Express API
├── packages/
│   └── types/       # Shared Zod schemas and TypeScript types
└── api/             # Vercel serverless entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (local or Atlas)
- An SMTP email provider

### Installation

```bash
# Install all dependencies
npm run install
```

### Environment Variables

Create a `.env` file in `server/`:

```env
# Required
MONGO_URL=mongodb+srv://...
SESSION_SECRET=your-session-secret

# Optional (defaults shown)
PORT=8000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Required in production
ALLOWED_ORIGINS=https://yourdomain.com

# Email (required for verification and password reset)
EMAIL_USER=your@email.com
EMAIL_PASS=your-email-password

# Error tracking
SENTRY_DSN=https://...
```

> If the project is deployed on Vercel, run `vercel env pull` in the `server/` directory to pull all environment variables locally.

### Running Locally

```bash
# Run both client and server concurrently
npm run dev

# Or run separately
npm run dev:server   # Express API on http://localhost:8000
npm run dev:client   # Vite dev server on http://localhost:5173
```

### Testing the Production Build Locally

Vercel handles the build on deploy, but you can simulate the production environment locally to debug issues that only appear in compiled output (e.g. path alias resolution, missing env vars, build-time errors).

```bash
# 1. Compile both packages
npm run build

# 2. Run the compiled server + client preview together
npm start
```

The client preview runs on http://localhost:4173 (instead of the usual 5173). Make sure `server/.env` is present — the compiled server still reads env vars at runtime.

### Seeding the Database

```bash
# Seed a dev user (dev@lucid.com / password123) with a full game library
npm run seed

# Seed a demo user (demo@lucid.com / lucid-demo) with a full game library
npm run seed:demo

# Run against a specific database
MONGO_URL=<uri> node --import tsx scripts/seed.ts
```

## Testing

```bash
# Run all tests (client + server)
npm test

# Run individually
npm run test:client
npm run test:server

# Watch mode
npm run test:client:watch
npm run test:server:watch
```

The server tests use an in-memory MongoDB instance via `mongodb-memory-server` — no database connection required.

## API Reference

All endpoints are prefixed with `/api/v1`.

### Auth

| Method | Endpoint                    | Protected | Description                    |
| ------ | --------------------------- | --------- | ------------------------------ |
| `POST` | `/auth/register`            | No        | Register a new account         |
| `GET`  | `/auth/verify-email?token=` | No        | Verify email address           |
| `POST` | `/auth/signin`              | No        | Sign in                        |
| `POST` | `/auth/signout`             | Yes       | Sign out                       |
| `GET`  | `/auth/session`             | No        | Get current session user       |
| `POST` | `/auth/forgot-password`     | No        | Request a password reset email |
| `POST` | `/auth/reset-password`      | No        | Reset password using a token   |

### User

All user endpoints require authentication and ownership (`userId` must match the session user).

| Method   | Endpoint                 | Description                                   |
| -------- | ------------------------ | --------------------------------------------- |
| `PATCH`  | `/user/:userId`          | Update profile (first name, last name, email) |
| `PATCH`  | `/user/:userId/password` | Change password                               |
| `DELETE` | `/user/:userId`          | Delete account                                |

### Library

All library endpoints require authentication and ownership.

| Method   | Endpoint                        | Description                         |
| -------- | ------------------------------- | ----------------------------------- |
| `GET`    | `/user/:userId/library`         | Get all games in the user's library |
| `POST`   | `/user/:userId/library`         | Add a game to the library           |
| `PATCH`  | `/user/:userId/library/:gameId` | Update a game entry                 |
| `DELETE` | `/user/:userId/library/:gameId` | Remove a game from the library      |

## Deployment

The app is deployed on Vercel. The client is served as a static site and the server runs as a serverless function under `/api`.

```bash
vercel deploy
```

The `vercel.json` at the repo root configures the build:

- `/api/*` requests are routed to the Express serverless handler
- All other requests serve the React SPA (`index.html`)

## Code Quality

```bash
# Lint
npm run lint

# Type check
npm run typecheck
```

Pre-commit hooks (Husky) run type checking and tests before every commit.

## Entity Relationship Diagram

See [ERD.md](./ERD.md).
