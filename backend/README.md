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

## Endpoints

- GET /health
- GET /ready
- GET /api/v1/portfolio
- POST /api/v1/orders
- GET /api/v1/quotes
