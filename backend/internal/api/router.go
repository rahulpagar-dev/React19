package api

import (
	"database/sql"
	"net/http"

	"github.com/rahulpagar-dev/react19/backend/internal/api/handlers"
)

func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Authorization, X-Requested-With")
		}

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next(w, r)
	}
}

func NewRouter(db *sql.DB) http.Handler {
	mux := http.NewServeMux()
	auth := NewAuthHandler(db)

	mux.HandleFunc("/health", withCORS(handlers.Health))
	mux.HandleFunc("/ready", withCORS(handlers.Ready))
	mux.HandleFunc("/api/v1/auth/session", withCORS(auth.CreateSession))
	mux.HandleFunc("/api/v1/auth/me", withCORS(auth.Me))
	mux.HandleFunc("/api/v1/auth/logout", withCORS(auth.Logout))
	mux.HandleFunc("/api/v1/portfolio", withCORS(handlers.GetPortfolio))
	mux.HandleFunc("/api/v1/orders", withCORS(handlers.CreateOrder))
	mux.HandleFunc("/api/v1/quotes", withCORS(handlers.GetQuotes))

	return mux
}
