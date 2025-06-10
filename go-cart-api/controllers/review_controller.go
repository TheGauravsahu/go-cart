package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/TheGauravsahu/go-cart/internal/application"
	"github.com/TheGauravsahu/go-cart/models"
	"github.com/TheGauravsahu/go-cart/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func CreateReview(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var review models.Review
		if err := c.ShouldBindJSON(&review); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid review body"})
			return
		}
		if errs := utils.ValidateStruct(review); errs != nil {
			c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
			return
		}

		productID, _ := primitive.ObjectIDFromHex(c.Param("productId"))

		userIDHex := c.MustGet("user_id").(string)
		userID, err := primitive.ObjectIDFromHex(userIDHex)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
			return
		}

		review.UserID = userID
		review.ID = primitive.NewObjectID()
		review.ProductID = productID
		review.CreatedAt = time.Now()
		review.UpdatedAt = time.Now()

		_, err = app.ReviewCollection.InsertOne(ctx, review)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not save review"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"message": "Review created"})
	}
}

func GetReviewsByProduct(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		productID, _ := primitive.ObjectIDFromHex(c.Param("productId"))
		cursor, err := app.ReviewCollection.Find(ctx, bson.M{"product_id": productID})
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "could not get product"})
			return
		}

		var reviews []models.Review
		if err = cursor.All(ctx, &reviews); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error getting reviews"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "All reviews fetched successfully", "data": gin.H{"reviews": reviews}})
	}
}

type UpdateReviewDTO struct {
	Rating  int    `json:"rating"`
	Comment string `json:"comment"`
}

func UpdateReview(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		reviewID, _ := primitive.ObjectIDFromHex(c.Param("id"))
		userIDHex := c.MustGet("user_id").(string)
		userID, err := primitive.ObjectIDFromHex(userIDHex)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
			return
		}

		var updateReviewData UpdateReviewDTO
		if err := c.ShouldBindJSON(&updateReviewData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid review json data"})
			return
		}
		if errs := utils.ValidateStruct(updateReviewData); errs != nil {
			c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
			return
		}

		filter := bson.M{"_id": reviewID, "user_id": userID}
		update := bson.M{
			"$set": bson.M{
				"rating":    updateReviewData.Rating,
				"comment":   updateReviewData.Comment,
				"updatedAt": time.Now(),
			},
		}

		_, err = app.ReviewCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update review"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Review updated"})
	}
}

func DeleteReview(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		reviewID, _ := primitive.ObjectIDFromHex(c.Param("id"))
		userIDHex := c.MustGet("user_id").(string)
		userID, err := primitive.ObjectIDFromHex(userIDHex)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
			return
		}

		filter := bson.M{"_id": reviewID, "user_id": userID}
		res, err := app.ReviewCollection.DeleteOne(ctx, filter)
		if err != nil || res.DeletedCount == 0 {
			c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to delete this review"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Review deleted"})
	}
}
