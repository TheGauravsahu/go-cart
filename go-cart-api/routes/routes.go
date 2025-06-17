package routes

import (
	"github.com/TheGauravsahu/go-cart/controllers"
	"github.com/TheGauravsahu/go-cart/internal/application"
	"github.com/TheGauravsahu/go-cart/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, app *application.Application) {
	// Auth routes
	auth := r.Group("/auth")
	{
		auth.POST("/signup", controllers.SignUp(app))
		auth.POST("/login", controllers.Login(app))
	}

	// User routes (protected)
	user := r.Group("/users")
	user.Use(middleware.Authenticate(app.UserCollection))
	{
		user.GET("/me", controllers.GetProfile(app))
		user.POST("/me", controllers.UpdateProfile(app))

		// Address Routes
		addresses := user.Group("/address")
		{
			addresses.POST("/", controllers.AddAddress(app))
			addresses.PUT("/:id", controllers.EditAddress(app))
			addresses.DELETE("/:id", controllers.DeleteAddress(app))
			addresses.GET("/", controllers.GetAllAddresses(app))
			addresses.GET("/:id", controllers.GetAddressByID(app))
		}

		// Order Routes
		orders := user.Group("/orders")
		{
			orders.POST("/checkout", controllers.CheckoutOrder(app))
			orders.GET("/", controllers.GetAllOrders(app))
			orders.GET("/:id", controllers.GetOrderByID(app))
			orders.PUT("/:id", controllers.UpdateOrderStatus(app))
		}
	}

	// Product Routes (Public)
	products := r.Group("/products")
	{
		products.GET("/", controllers.GetAllProducts(app))
		products.GET("/search", controllers.SearchProducts(app))
		products.GET("/:productId", controllers.GetProductByID(app)) // Optional detail route

		reviews := products.Group("/:productId/reviews")
		{
			reviews.GET("/", controllers.GetReviewsByProduct(app))
			reviews.POST("/", middleware.Authenticate(app.UserCollection), controllers.CreateReview(app))
			reviews.PUT("/:id", middleware.Authenticate(app.UserCollection), controllers.UpdateReview(app))
			reviews.DELETE("/:id", middleware.Authenticate(app.UserCollection), controllers.DeleteReview(app))
		}
	}

	// Admin routes (protected)
	admin := r.Group("/admin")
	admin.Use(middleware.Authenticate(app.UserCollection))
	{
		admin.POST("/products", controllers.AddProduct(app))
		admin.PUT("/products/:id", controllers.UpdateProduct(app))
		admin.DELETE("/products/:id", controllers.DeleteProduct(app))
	}
}
