# Project Architecture

## 1. Overview

This project is a portfolio management dashboard with a split architecture:

- Frontend: React + TypeScript + Vite
- Backend: Go HTTP API
- Database: PostgreSQL
- Authentication: cookie-based session auth
- Styling: Tailwind CSS + custom CSS variables + component library patterns inspired by shadcn/ui
- UI/visual layer: Radix primitives, MUI, Lucide icons, Recharts, motion-based interactions

The app is organized as a frontend application in the root `src/` folder and a separate backend service in `backend/`.

---

## 2. Technology Stack

### Frontend

- React 18.3.1
- TypeScript
- Vite 6
- React Router (`react-router`)
- React DOM

### Backend

- Go 1.26.1
- Standard library `net/http`
- PostgreSQL driver via `pgx/v5`
- SQL-based persistence

### Database

- PostgreSQL
- Connection via `DATABASE_URL`
- Session and user records managed by SQL tables

### Styling

- Tailwind CSS 4
- CSS custom properties and design tokens in `src/styles/theme.css`
- Component styling patterns using `class-variance-authority`, `clsx`, `tailwind-merge`
- Radix UI primitives for accessible components

### State Management

- No Redux/Zustand/React Query store is currently used
- Application-level state is managed with React Context + local component state + hooks
- The main app state lives in `src/app/App.tsx` and is exposed via `createContext` / `useContext`

### API and Data Access

- Frontend uses a shared fetch wrapper in `src/services/api.ts`
- Vite dev server proxies `/api` requests to the Go backend (`http://127.0.0.1:8080`)
- Backend routes are under `/api/v1/*`

---

## 3. Project Structure

```text
React19/
├── backend/
│   ├── cmd/
│   │   └── api/
│   │       └── main.go
│   ├── internal/
│   │   ├── api/
│   │   │   ├── auth.go
│   │   │   ├── router.go
│   │   │   └── handlers/
│   │   │       ├── health.go
│   │   │       └── portfolio.go
│   │   ├── domain/
│   │   │   └── models.go
│   │   └── infrastructure/
│   │       └── database/
│   │           └── postgres.go
│   ├── migrations/
│   │   └── 001_initial.sql
│   ├── go.mod
│   └── README.md
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── components/
│   │       ├── figma/
│   │       │   └── ImageWithFallback.tsx
│   │       └── ui/
│   │           ├── accordion.tsx
│   │           ├── alert-dialog.tsx
│   │           ├── alert.tsx
│   │           ├── aspect-ratio.tsx
│   │           ├── avatar.tsx
│   │           ├── badge.tsx
│   │           ├── breadcrumb.tsx
│   │           ├── button.tsx
│   │           ├── calendar.tsx
│   │           ├── card.tsx
│   │           ├── carousel.tsx
│   │           ├── chart.tsx
│   │           ├── checkbox.tsx
│   │           ├── collapsible.tsx
│   │           ├── command.tsx
│   │           ├── context-menu.tsx
│   │           ├── dialog.tsx
│   │           ├── drawer.tsx
│   │           ├── dropdown-menu.tsx
│   │           ├── form.tsx
│   │           ├── hover-card.tsx
│   │           ├── input-otp.tsx
│   │           ├── input.tsx
│   │           ├── label.tsx
│   │           ├── menubar.tsx
│   │           ├── navigation-menu.tsx
│   │           ├── pagination.tsx
│   │           ├── popover.tsx
│   │           ├── progress.tsx
│   │           ├── radio-group.tsx
│   │           ├── resizable.tsx
│   │           ├── scroll-area.tsx
│   │           ├── select.tsx
│   │           ├── separator.tsx
│   │           ├── sheet.tsx
│   │           ├── sidebar.tsx
│   │           ├── skeleton.tsx
│   │           ├── slider.tsx
│   │           ├── sonner.tsx
│   │           ├── switch.tsx
│   │           ├── table.tsx
│   │           ├── tabs.tsx
│   │           ├── textarea.tsx
│   │           ├── toggle-group.tsx
│   │           ├── toggle.tsx
│   │           ├── tooltip.tsx
│   │           ├── use-mobile.ts
│   │           └── utils.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── msg91.ts
│   ├── styles/
│   │   ├── fonts.css
│   │   ├── globals.css
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   └── theme.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── default_shadcn_theme.css
├── index.html
├── package.json
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── README.md
├── vite.config.ts
└── PROJECT_ARCHITECTURE.md
```

---

## 4. Frontend Architecture

### App shell

The main application logic is centralized in `src/app/App.tsx`.

Responsibilities include:

- theme switching (light/dark/night)
- navigation state via custom route logic
- authenticated user management
- session/logout handling
- portfolio dashboard rendering
- dashboard, wallet, payment, and auth-view switching

### UI composition

The project uses a reusable design-system pattern:

- `src/app/components/ui/` contains generated component wrappers based on shadcn-style primitives
- components are designed to be composable and consistent
- `src/styles/theme.css` defines the theme tokens and CSS variables

### Routing pattern

There is not a full React Router page tree in the codebase. Instead, the app appears to simulate route-based navigation with local state and internal route mapping using helper functions like:

- `routeToPath`
- `pathToRoute`
- `navigate(page, subview)`

This keeps the app as a dashboard-like single-page experience rather than a multi-page app.

---

## 5. Backend Architecture

### API structure

The backend lives under `backend/internal/api` and exposes endpoints through `NewRouter(...)` in `router.go`.

Current routes:

- `GET /health`
- `GET /ready`
- `POST /api/v1/auth/session`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `GET /api/v1/portfolio`
- `POST /api/v1/orders`
- `GET /api/v1/quotes`

### Auth model

Authentication is implemented in `backend/internal/api/auth.go`.

- creates or updates a user record with `full_name` and `phone_number`
- creates a session token and stores its hash
- sets an `asset_session` HTTP-only cookie
- validates session on `/auth/me`
- revokes session on logout

This is a server-side session model built on PostgreSQL rather than JWTs.

### Database layer

The database connection is opened through `backend/internal/infrastructure/database/postgres.go`.

- reads `DATABASE_URL`
- opens a Postgres SQL pool using `pgx`
- pings the database to verify connectivity

### Domain model

The domain definitions in `backend/internal/domain/models.go` include:

- `PortfolioSummary`
- `Holding`
- `Order`
- `Quote`
- `CreateOrderRequest`
- `ErrorResponse`

---

## 6. Styling and Design System

### Styling approach

The frontend is built around:

- Tailwind CSS v4
- CSS variables for theme colors and spacing
- `@theme inline` token mapping in `src/styles/theme.css`
- `src/styles/index.css` and `src/styles/tailwind.css` for global styling layers

### Theme system

The app supports multiple visual themes via a custom `ThemeMode` type:

- `light`
- `dark`
- `night`

Theme values are defined in `src/app/App.tsx` via a `themes` object that maps CSS variables to different color schemes.

### Component stack

UI components rely on:

- Radix UI primitives for accessibility, dialogs, menus, dropdowns, popovers, etc.
- `@mui/material` and `@mui/icons-material` for additional building blocks and iconography
- Lucide React for crisp icon set
- `class-variance-authority`, `clsx`, and `tailwind-merge` for utility and variant styling

---

## 7. State Management

The current state flow is lightweight and local to the app:

- `useState` for component-level interactions
- `createContext` for app-wide settings like theme, user, navigation, and auth state
- no centralized global state library such as Redux, Zustand, or MobX

Typical app-level state includes:

- selected theme
- focus mode
- current route/page
- current logged-in user
- logout function and session helpers

This is a simple dashboard architecture designed for a relatively contained app rather than a large enterprise state management system.

---

## 8. Third-Party Libraries and Their Roles

### Core UI

- `@mui/material` / `@mui/icons-material` — component baseline and icons
- `@radix-ui/*` — accessible menu, dialog, select, sheet, popover, tabs, and form primitives
- `lucide-react` — icon set
- `motion` — animation / transition enhancements

### Forms and Input

- `react-hook-form` — form management
- `input-otp` — OTP input component
- `date-fns` — date utilities
- `react-day-picker` — calendar and date selection

### Visualization and Charts

- `recharts` — dashboard charts and analytics UI
- `react-resizable-panels` — resizable panel layouts

### Interaction and UX

- `sonner` — toast notifications
- `cmdk` — command palette/search UI
- `vaul` — drawer / sheet patterns
- `embla-carousel-react` — carousel support
- `react-dnd` / `react-dnd-html5-backend` — drag and drop support
- `react-slick` / `react-responsive-masonry` — gallery and masonry-like layouts

### Utility / Styling

- `clsx` — conditional class names
- `tailwind-merge` — class merging
- `class-variance-authority` — component variants
- `tailwindcss` / `@tailwindcss/vite` — Tailwind integration
- `next-themes` — theme management support

### Data and communication

- `fetch` wrapper in `src/services/api.ts` for API requests
- `src/services/msg91.ts` for OTP / SMS integration

---

## 9. API and Frontend Communication Flow

1. Frontend requests are sent through `src/services/api.ts`
2. Vite proxies `/api` requests to the Go backend
3. Go server handles auth, portfolio, quotes, and order endpoints
4. PostgreSQL stores user/session records and other persisted data
5. Frontend renders portfolio data, charts, wallet info, and user session state

The communication pattern is straightforward and centralized:

- frontend fetch layer
- Go API
- PostgreSQL persistence
- React rendering layer

---

## 10. Current Architecture Summary

This project is best described as a modern React front-end built around a dashboard-style portfolio application, paired with a lightweight Go API and PostgreSQL backend.

### Current design principles

- modular UI components
- design system tokens and theme variables
- context-based app state instead of heavy external state management
- server-side session auth
- data-rich dashboard layout with charts and portfolio analytics
- layered architecture separating UI, services, styles, and backend API

### Architecture style

The project currently follows a hybrid pattern:

- Frontend: component-driven SPA
- Backend: small API service with route handlers and DB access
- Styling: utility-first + design-token approach
- State: React context/local state
- Persistence: PostgreSQL via SQL queries

---

## 11. Recommended Future Direction

If the codebase grows, the natural next improvements would be:

- introduce a centralized state library only if app logic becomes complex
- separate page modules/components into feature-based folders
- add stronger backend validation and service layers
- introduce API client abstraction for more resilient error handling
- add tests for auth, portfolio, and session flows

For the current stage, the architecture is clean, lightweight, and suitable for a portfolio dashboard MVP.
