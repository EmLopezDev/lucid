# Changelog

## [1.1.0] - 2026-05-17

### Workspaces

- Added workspaces to the project
- Cleaned up package.json file in each workspace
- Updated README with new npm scripts
- minor fixes to UserLibraryContext and SignInPageContext

## [1.0.0] - 2026-05-16

### Features

#### Authentication

- User registration with email verification (24-hour token, resend after 60 seconds)
- Sign in / sign out with server-side sessions
- Forgot password and reset password via email link
- Session regeneration on sign in and password change to prevent session fixation
- Protected demo and dev accounts (cannot be deleted)

#### Account Settings

- Update profile (first name, last name, email)
- Change password (requires current password, invalidates old session)
- Delete account (removes user, credentials, and full library in one transaction)

#### Game Library

- Add, edit, and delete games
- Fields: title, genre, platform, status, rating, hours played, price, dates, cover image, notes
- Filter by status, sort by multiple fields
- Cover images via Steam CDN

#### Dashboard

- Hero stats (total games, hours played, total spend, average rating)
- Status breakdown chart
- Spending chart

#### Homepage

- Landing page with demo account shortcut

### Infrastructure

- MongoDB with Mongoose (transactions for multi-document writes)
- Express sessions backed by MongoDB store
- Rate limiting: auth routes (10 req/15min), general routes (100 req/15min)
- Sentry error tracking on client and server
- Pino structured logging
- CSP headers via custom Vite plugin
- Vercel deployment (client + server)
- Husky pre-commit (lint, typecheck) and pre-push (tests)

### Testing

- 73 server integration tests covering auth, user, and library flows
- 419 client unit tests covering components, contexts, hooks, and lib functions

---

[1.0.0]: https://github.com/EmLopezDev/lucid/releases/tag/v1.0.0
