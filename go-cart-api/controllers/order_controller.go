package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/TheGauravsahu/go-cart/internal/application"
	"github.com/TheGauravsahu/go-cart/models"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func CheckoutOrder(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var req struct {
			Items         []models.CartItem `json:"items" binding:"required"`
			AddressID     string            `json:"address_id" binding:"required"`
			PaymentMethod models.Payment    `json:"payment_method" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
			return
		}

		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		// Calculate total price
		var total float64
		for _, item := range req.Items {
			total += item.Price * float64(item.Quantity)
		}

		order := models.Order{
			ID:            primitive.NewObjectID(),
			UserID:        userID.(string),
			Items:         req.Items,
			TotalPrice:    total,
			Discount:      0,
			OrderedAt:     time.Now(),
			Status:        "Pending",
			PaymentMethod: req.PaymentMethod,
		}

		_, err := app.OrderCollection.InsertOne(ctx, order)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Order placed successfully", "order": order})
	}
}
	
func GetOrderByID(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		orderID := c.Param("id")
		if orderID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Order ID is required"})
			return
		}
		objID, err := primitive.ObjectIDFromHex(orderID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Order ID"})
			return
		}

		var order models.Order
		err = app.OrderCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&order)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve order"})
			}
			return
		}
		c.JSON(http.StatusOK, order)
	}
}

func GetAllOrders(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		cursor, err := app.OrderCollection.Find(ctx, bson.M{"user_id": userID.(string)})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve orders"})
			return
		}
		defer cursor.Close(ctx)

		var orders []models.Order
		if err = cursor.All(ctx, &orders); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode orders"})
			return
		}

		c.JSON(http.StatusOK, orders)
	}
}

func UpdateOrderStatus(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		orderID := c.Param("id")
		if orderID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Order ID is required"})
			return
		}
		objID, err := primitive.ObjectIDFromHex(orderID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Order ID"})
			return
		}

		var input struct {
			Status string `json:"status" binding:"required"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
			return
		}

		update := bson.M{"$set": bson.M{"status": input.Status}}
		result, err := app.OrderCollection.UpdateOne(ctx, bson.M{"_id": objID}, update)
		if err != nil || result.MatchedCount == 0 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order status"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Order status updated successfully"})
	}
}
