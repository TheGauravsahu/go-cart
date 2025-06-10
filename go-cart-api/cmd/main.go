package main

import (
	"log"
	"os"
	"time"

	"github.com/TheGauravsahu/go-cart/database"
	"github.com/TheGauravsahu/go-cart/internal/application"
	"github.com/TheGauravsahu/go-cart/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	client := database.ConnectToDb()

	app := application.NewApplication(
		database.GetCollection(client, "Products"),
		database.GetCollection(client, "Users"),
		database.GetCollection(client, "Orders"),
		database.GetCollection(client, "Reviews"),
	)

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		log.Fatal("FRONTEND_URL is not set in .env")
	}

	// log.Println("frontendURL:", frontendURL)

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	router.Use(gin.Logger())

	routes.RegisterRoutes(router, app)

	log.Fatal(router.Run(":" + port))
}
