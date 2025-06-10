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
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func AddProduct(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		var product models.Product
		if err := c.ShouldBindJSON(&product); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product body"})
			return
		}

		if errs := utils.ValidateStruct(product); errs != nil {
			c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
			return
		}

		product.ID = primitive.NewObjectID()
		product.CreatedAt = time.Now()
		product.UpdatedAt = time.Now()

		_, err := app.ProductCollection.InsertOne(ctx, product)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add product"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Product added successfully"})
	}
}

func GetAllProducts(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		cursor, err := app.ProductCollection.Find(ctx, bson.M{})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
			return
		}
		defer cursor.Close(ctx)

		var products []models.Product
		if err = cursor.All(ctx, &products); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode products"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Products fetched successfully", "data": products})
	}
}

func GetProductByID(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		idParam := c.Param("productId")
		if idParam == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product ID is required"})
			return
		}

		objectID, err := primitive.ObjectIDFromHex(idParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID format"})
			return
		}

		var product models.Product
		err = app.ProductCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&product)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch product"})
			}
			return
		}

		c.JSON(http.StatusOK, product)
	}
}

func SearchProducts(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		query := c.Query("q")
		if query == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Search query required"})
			return
		}

		filter := bson.M{
			"$or": []bson.M{
				{"name": bson.M{"$regex": query, "$options": "i"}},
				{"category": bson.M{"$regex": query, "$options": "i"}},
			},
		}

		cursor, err := app.ProductCollection.Find(ctx, filter)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search products"})
			return
		}
		defer cursor.Close(ctx)

		var products []models.Product
		if err := cursor.All(ctx, &products); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode search results"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Found Products", "data": gin.H{"products": products}})
	}
}

func UpdateProduct(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		idParam := c.Param("id")
		if idParam == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product ID is required"})
			return
		}
		objectID, err := primitive.ObjectIDFromHex(idParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID format"})
			return
		}

		var product models.Product
		if err := c.ShouldBindJSON(&product); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product body"})
			return
		}

		if errs := utils.ValidateStruct(product); errs != nil {
			c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
			return
		}

		product.UpdatedAt = time.Now()
		update := bson.M{
			"$set": product,
		}
		_, err = app.ProductCollection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update product"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Product updated successfully"})
	}
}

func DeleteProduct(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		idParam := c.Param("id")
		if idParam == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "product ID is required"})
			return
		}

		objectID, err := primitive.ObjectIDFromHex(idParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID format"})
			return
		}

		result, err := app.ProductCollection.DeleteOne(ctx, bson.M{"_id": objectID})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete product"})
			return
		}

		if result.DeletedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
	}
}
