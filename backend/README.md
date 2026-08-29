# Backend API Service

This backend starter follows a modular monolith layout for an asset-management and trading platform.

## Structure

- cmd/api - application entrypoint
- internal/api - HTTP router and handlers
- internal/domain - domain models and contracts
- internal/infrastructure - future persistence, cache, messaging clients

## Run locally

```bash
cd backend
go run ./cmd/api
```

Set `DATABASE_URL` before starting the service to enable PostgreSQL persistence:

```bash
export DATABASE_URL='postgres://user:password@localhost:5432/asset_platform?sslmode=disable'
psql "$DATABASE_URL" -f migrations/001_initial.sql
go run ./cmd/api
```

The service currently logs a warning and runs without persistence when `DATABASE_URL` is not set. Authentication and user data will require the database configuration.

## Endpoints

- GET /health
- GET /ready
- POST /api/v1/auth/session
- GET /api/v1/auth/me
- POST /api/v1/auth/logout
- GET /api/v1/portfolio
- POST /api/v1/orders
- GET /api/v1/quotes

The frontend completes OTP verification with the MSG91 widget and exchanges the result for an HTTP-only session at `/api/v1/auth/session`. Before production deployment, configure the MSG91 server-side verification API in the backend so the session endpoint independently validates the verification result instead of trusting a browser assertion.
