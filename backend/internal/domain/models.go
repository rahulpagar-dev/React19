package domain

type PortfolioSummary struct {
	TotalValue       float64   `json:"totalValue"`
	DayChange        float64   `json:"dayChange"`
	DayChangePercent float64   `json:"dayChangePercent"`
	CashBalance      float64   `json:"cashBalance"`
	Holdings         []Holding `json:"holdings"`
}

type Holding struct {
	Symbol string  `json:"symbol"`
	Name   string  `json:"name"`
	Qty    int     `json:"qty"`
	Price  float64 `json:"price"`
	Value  float64 `json:"value"`
}

type Order struct {
	ID        string  `json:"id"`
	Symbol    string  `json:"symbol"`
	Side      string  `json:"side"`
	Qty       int     `json:"qty"`
	Price     float64 `json:"price"`
	Status    string  `json:"status"`
	CreatedAt string  `json:"createdAt"`
}

type Quote struct {
	Symbol string  `json:"symbol"`
	Price  float64 `json:"price"`
	Change float64 `json:"change"`
}

type CreateOrderRequest struct {
	Symbol string  `json:"symbol" binding:"required"`
	Side   string  `json:"side" binding:"required"`
	Qty    int     `json:"qty" binding:"required"`
	Price  float64 `json:"price"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}
