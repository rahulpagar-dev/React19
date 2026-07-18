package main

import (
	"log"
	"net/http"
	"os"

	"github.com/rahulpagar-dev/react19/backend/internal/api"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := api.NewRouter()
	log.Printf("starting asset platform API on :%s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
