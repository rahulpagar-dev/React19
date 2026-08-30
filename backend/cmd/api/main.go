package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/rahulpagar-dev/react19/backend/internal/api"
	"github.com/rahulpagar-dev/react19/backend/internal/infrastructure/database"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	var db *sql.DB
	if os.Getenv("DATABASE_URL") != "" {
		var err error
		db, err = database.OpenFromEnv(context.Background())
		if err != nil {
			log.Fatalf("database initialization failed: %v", err)
		}
		defer db.Close()
		log.Printf("connected to postgres")
	} else {
		log.Printf("DATABASE_URL is not configured; running without persistence")
	}

	r := api.NewRouter(db)
	log.Printf("starting asset platform API on :%s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
