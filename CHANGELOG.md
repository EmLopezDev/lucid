# Changelog

## [1.7.0] - 2026-06-03

### Features

#### Profile Page — Dashboard Consolidation

- Dashboard page removed — all content consolidated into the Profile page
- Dashboard nav link removed — navigation is now Library | Profile
- New **Expenditure** tab on the Profile page containing the spending chart and a Total Spent hero stat
- New **Stats** tab additions: Status Breakdown chart and Genre Breakdown chart rendered side-by-side below the hero stat cards
- Stats tab hero stats now use the `HeroStats` component for consistent styling with the rest of the app

#### Profile Page — Genre Breakdown Chart

- New donut chart showing library genre distribution with a custom legend and tooltip
- Built on the existing Recharts setup, sourced from `UserLibraryContext` for full library coverage
- Renders nothing when no games have a genre set

#### Backend

- `totalSpent` added to the profile stats response — sum of all priced library entries, `null` when no games have a price set
- `mostPlayedGenre` replaces `favoriteGenre` as the field name in the profile stats response

### Improvements

#### Profile Page — Stat Card Color Tints

- Each stat card now has a subtle tinted background matching its icon colour
- Modifier classes renamed to semantic names (`--games`, `--hours`, `--completion`, `--rating`, `--genre`) so colours can change without touching class names

#### Icon Component

- Added `cyan` and `purple` colour variants

#### Design Tokens

- Added `--color-green`, `--color-green-rgb`, `--color-orange`, `--color-orange-rgb`, `--color-cyan`, and `--color-cyan-rgb` to both dark and light theme

#### HeroStats Component

- `statValue` now accepts `string | number` — string values are automatically capitalised via `capitalizeString`
- Number formatting unchanged: integers are rounded, decimals truncated to 2 places with count-up animation

## [1.6.1] - 2026-05-29

### Improvements

#### Profile Page

- Game cards in Currently Playing, Completed, and Recently Added tabs now match the dashboard card style — wider 130px cover, coloured top-border accent per status, border, and hover state
- Games without a cover image now show a fallback gamepad icon centred in the cover area instead of a blank space
- Stat cards now display a coloured icon above each value (gamepad, clock, check, star, tag) using accent colours (blue, teal, green, gold, orange)
- Added `blue`, `teal`, `green`, `gold`, and `orange` colour variants to the `Icon` component

## [1.6.0] - 2026-05-27

### Features

#### Profile Page

- Added `/user/profile` page showing a user's identity, computed stats, and game lists
- Profile header displays avatar initials, full name, email, bio, member since date, and a settings icon link — stacked vertically with the name as the primary headline
- Stats section shows total games, total hours played, completion rate, average rating, and favourite genre — all computed from the library at request time
- Three game lists — Currently Playing, Completed, and Recently Added — each showing cover art and a status badge
- Skeleton loading state mirrors the page layout while data is in flight
- Added `Profile` nav link to both the desktop and mobile navigation menus
- Removed `Settings` from the main nav — settings are now accessed via the gear icon on the profile page

#### Bio

- Added `bio` field (max 160 characters) to the user model, schema, and shared types
- Bio textarea with live character counter added to the account settings profile form
- Bio is returned in all user select queries and persisted correctly through the settings save flow

#### Backend

- New `GET /api/v1/user/:userId/profile` endpoint protected by `requireAuth` and `requireOwner`
- Stats computed server-side from the user's library: total games, total hours played, completion rate (games with a status only), average rating (rated games only), and favourite genre by frequency
- Library sorted once at query time — all derived lists (currently playing, completed, recently added) reuse the sorted result with no redundant passes

### Testing

- 98 server integration tests (+20 covering the profile endpoint: auth guards, response shape, all stat computations, derived list filtering, and bio round-trip)
- 467 client unit tests

## [1.5.5] - 2026-05-26

### Features

- Added "Recently Added" section to the dashboard showing the last 6 games by date added
- Each game displays as a landscape card with cover art, title, status badge, and platform
- Cards use a coloured top border accent matching the game's status — consistent with the HeroStat card design language
- Cards are arranged in a 2-column grid on medium and large screens, single column on small screens
- Added `--color-badge-dropped` solid hex variable to both light and dark theme — previously only the RGB variant existed

### Testing

- 467 client unit tests (+16 new tests covering `useRecentGames` sort order, limit, mutation safety, and `RecentGames` rendering, status classes, and accessibility)

## [1.5.4] - 2026-05-25

### Improvements

- Transactional emails (verification and password reset) now use a styled HTML template matching the app's visual design — dark background, brand colours, and a prominent call-to-action button
- Lucid gem logo and wordmark appear in the email header, table-aligned for consistent rendering across all email clients
- Gem icon is embedded directly in the email as an inline attachment — no external URL required, works in all environments
- Plain text fallback added to all emails for clients that do not render HTML
- Removed leftover debug outline comment from base stylesheet

## [1.5.3] - 2026-05-24

### Accessibility

- Added `useReducedMotion` hook that reads the system `prefers-reduced-motion` setting and listens reactively for changes
- `useCountUp` now skips the animation loop entirely when reduced motion is preferred, returning the final value immediately with no intermediate renders
- Spending chart bar and line entrance animations are disabled when reduced motion is preferred

## [1.5.2] - 2026-05-23

### Bug Fixes

- Fixed "No results found" flashing before "Searching..." on first keystroke in game search — loading state is now true immediately while the debounce is pending
- Fixed `import.meta.env.Dev` typo (should be `DEV`) — console errors in development were never firing
- Stale search results are now cleared at the start of each new search instead of persisting behind the loading spinner

## [1.5.1] - 2026-05-22

### Bug Fixes

- Fixed filter dropdowns being clipped by their parent container on mobile — select listboxes now escape the filter panel correctly when open

## [1.5.0] - 2026-05-22

### Features

#### Optional Status, Genre, and Platform

- Title is now the only required field when adding a game
- Status, genre, and platform all default to `null` — users can add a game quickly and fill in details later
- All three select dropdowns now include a "Not set" option as the first choice
- Badge renders nothing when status is null
- Cards and detail view show `–` for null genre and platform
- Status breakdown chart on the dashboard excludes null-status games

### Infrastructure

- `Status`, `Genre`, and `Platform` Zod schemas made nullable at the definition level — the change cascades automatically to all schemas that use them
- Mongoose schema updated to allow null for `status`, `genre`, and `platform`
- `GameSearchResult.platforms` typed as `string[]` (decoupled from nullable `PlatformType`) since RAWG always returns real values
- `StatusFilterType` preserved as-is — null-status games appear under "all" naturally

### Testing

- 453 client unit tests (+8 new tests covering null status, genre, and platform rendering)
- 77 server integration tests (updated add-game test to assert title-only submissions return 201 with null fields)

## [1.4.0] - 2026-05-21

### Features

#### Game Search

- Add game form now includes a search-as-you-type title field powered by the RAWG API
- Search results appear in a dropdown with cover art thumbnails and game titles
- Selecting a game auto-populates the platform and genre fields with the game's actual data
- Genre and platform dropdowns are filtered to only the options relevant to the selected game
- Cover art is automatically saved to the game record when a game is selected from search

#### SearchInput Component

- New generic `SearchInput<T>` component — reusable for any future search needs
- Full keyboard navigation: `ArrowDown` / `ArrowUp` to move through results, `Enter` to select, `Escape` to close
- Dropdown scrolls to keep the focused item in view during keyboard navigation
- Pressing `Enter` no longer accidentally submits the form while the dropdown is open
- Animated dropdown with staggered result fade-in and a pulsing loading indicator

#### Expanded Genres and Platforms

- Genre list expanded from 4 to 17 values aligned with RAWG (action, adventure, role-playing, strategy, shooter, simulation, puzzle, platformer, racing, sports, fighting, indie, casual, arcade, multiplayer, family, other)
- Platform field changed from a fixed enum to a free-form string with 30+ curated options across PlayStation, Xbox, Nintendo, PC, and mobile
- Existing library data migrated to the new genre and platform values

### Infrastructure

- Added RAWG API service on the server with a `GET /api/v1/games/search` endpoint
- CSP updated to allow images from `media.rawg.io`
- Server now loads `.env.local` before `.env` so local secrets stay out of version control
- Added `:prod` migration script variants for running against the production database

### Testing

- 445 client unit tests (+26 new tests covering `SearchInput` behaviour and keyboard navigation)
- 77 server integration tests (+5 new tests covering the game search endpoint)

## [1.3.1] - 2026-05-19

### Bug Fixes

- Fixed error at start up due to race condition between Vite and Node
- Removed 401 response from initial session check
- Updated test for session
- Added .markdownlist.json file to override some rules for CHANGELOG.md

## [1.3.0] - 2026-05-18

### Features

- Added toast notifications across the app using `sonner`
- Sign in: "Welcome back, [first name]" on success
- Sign out: confirmation toast on sign out
- Game library: success and error toasts for add, edit, and delete actions
- Account settings: success toasts for profile update, password change, and account deletion
- Removed inline `isSuccess` state from profile and password views in favour of toasts

## [1.2.1] - 2026-05-17

### Bug Fixes

- Fixed game dates displaying one day behind due to UTC/local timezone conversion in `formatDate`
- Fixed production 500 error on sign in — replaced TypeScript path aliases with relative imports (Vercel's Node.js runtime does not support path mappings)
- Fixed session save errors being silently swallowed — now routed through the error handler so Sentry captures them

## [1.2.0] - 2026-05-17

### npm Scripts

- Added `build`, `start`, `ci`, and `clean` scripts to root
- Added `build` script to server (`tsc && tsc-alias`)
- Parallelized `lint` and `test` at root using `concurrently`
- Renamed `watch` → `dev`; added `dev:server` and `dev:client`
- Replaced `--prefix` flags with `-w` workspace flags throughout
- Removed manual `install:server`, `install:client`, and `install` scripts (handled by workspaces)

### Bug Fixes

- Fixed `SignInPageContext` calling `setFormData` during render — moved routing logic to `SignInPage` and replaced with `initialValues` prop
- Fixed server `tsconfig.json`: corrected `rootDir` from `/` to `..`, fixed packages include from absolute to relative path, fixed test exclude pattern
- Fixed vitest picking up compiled test files from `dist/` after build — added `exclude: ["dist/**"]` to vitest config

### Documentation

- Renamed ambiguous "Auth" column to "Protected" in API reference table
- Added "Testing the Production Build Locally" section to README

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

[1.7.0]: https://github.com/EmLopezDev/lucid/releases/tag/v1.7.0
[1.6.0]: https://github.com/EmLopezDev/lucid/releases/tag/v1.6.0
[1.5.5]: https://github.com/EmLopezDev/lucid/releases/tag/v1.5.5
[1.5.4]: https://github.com/EmLopezDev/lucid/releases/tag/v1.5.4
[1.5.3]: https://github.com/EmLopezDev/lucid/releases/tag/v1.5.3
[1.5.2]: https://github.com/EmLopezDev/lucid/releases/tag/v1.5.2
[1.5.1]: https://github.com/EmLopezDev/lucid/releases/tag/v1.5.1
[1.5.0]: https://github.com/EmLopezDev/lucid/releases/tag/v1.5.0
[1.4.0]: https://github.com/EmLopezDev/lucid/releases/tag/v1.4.0
[1.3.1]: https://github.com/EmLopezDev/lucid/releases/tag/v1.3.1
[1.3.0]: https://github.com/EmLopezDev/lucid/releases/tag/v1.3.0
[1.2.1]: https://github.com/EmLopezDev/lucid/releases/tag/v1.2.1
[1.2.0]: https://github.com/EmLopezDev/lucid/releases/tag/v1.2.0
[1.1.0]: https://github.com/EmLopezDev/lucid/releases/tag/v1.1.0
[1.0.0]: https://github.com/EmLopezDev/lucid/releases/tag/v1.0.0
