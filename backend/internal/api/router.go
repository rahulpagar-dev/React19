package api

import (
	"database/sql"
	"net/http"

	"github.com/rahulpagar-dev/react19/backend/internal/api/handlers"
)

func NewRouter(db *sql.DB) http.Handler {
	mux := http.NewServeMux()
	auth := NewAuthHandler(db)

	mux.HandleFunc("/health", handlers.Health)
	mux.HandleFunc("/ready", handlers.Ready)
	mux.HandleFunc("/api/v1/auth/session", auth.CreateSession)
	mux.HandleFunc("/api/v1/auth/me", auth.Me)
	mux.HandleFunc("/api/v1/auth/logout", auth.Logout)
	mux.HandleFunc("/api/v1/portfolio", handlers.GetPortfolio)
	mux.HandleFunc("/api/v1/orders", handlers.CreateOrder)
	mux.HandleFunc("/api/v1/quotes", handlers.GetQuotes)

	return mux
}
