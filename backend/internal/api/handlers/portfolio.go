package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/rahulpagar-dev/react19/backend/internal/domain"
)

func GetPortfolio(w http.ResponseWriter, r *http.Request) {
	portfolio := domain.PortfolioSummary{
		TotalValue:       1250000.50,
		DayChange:        18420.75,
		DayChangePercent: 1.49,
		CashBalance:      125000,
		Holdings: []domain.Holding{
			{Symbol: "AAPL", Name: "Apple Inc.", Qty: 120, Price: 192.45, Value: 23094},
			{Symbol: "MSFT", Name: "Microsoft Corp.", Qty: 90, Price: 378.85, Value: 34096.5},
			{Symbol: "NVDA", Name: "NVIDIA Corp.", Qty: 60, Price: 495.80, Value: 29748},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(portfolio)
}

func CreateOrder(w http.ResponseWriter, r *http.Request) {
	var req domain.CreateOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(domain.ErrorResponse{Error: "invalid request body"})
		return
	}

	order := domain.Order{
		ID:        "ORD-1001",
		Symbol:    req.Symbol,
		Side:      req.Side,
		Qty:       req.Qty,
		Price:     req.Price,
		Status:    "accepted",
		CreatedAt: "2026-07-18T00:00:00Z",
	}

	w.WriteHeader(http.StatusAccepted)
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(order)
}

func GetQuotes(w http.ResponseWriter, r *http.Request) {
	quotes := []domain.Quote{
		{Symbol: "AAPL", Price: 192.45, Change: 1.24},
		{Symbol: "MSFT", Price: 378.85, Change: 0.82},
		{Symbol: "NVDA", Price: 495.80, Change: 3.10},
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(quotes)
}
