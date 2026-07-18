package api

import (
	"net/http"

	"github.com/rahulpagar-dev/react19/backend/internal/api/handlers"
)

func NewRouter() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/health", handlers.Health)
	mux.HandleFunc("/ready", handlers.Ready)
	mux.HandleFunc("/api/v1/portfolio", handlers.GetPortfolio)
	mux.HandleFunc("/api/v1/orders", handlers.CreateOrder)
	mux.HandleFunc("/api/v1/quotes", handlers.GetQuotes)

	return mux
}
