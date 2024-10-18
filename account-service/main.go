package main

import (
	"account-service/database"
	"account-service/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {

	database.InitDB()
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization, jwt",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))
	router.SetupRoutes(app)

	app.Listen(":8081")
}
