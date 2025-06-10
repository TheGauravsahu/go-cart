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

func AddAddress(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var address models.Address
		if err := c.ShouldBindJSON(&address); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid address body"})
			return
		}

		if errs := utils.ValidateStruct(address); errs != nil {
			c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
			return
		}

		address.Address_ID = primitive.NewObjectID().Hex()
		address.CreatedAt = time.Now()
		address.UpdatedAt = time.Now()

		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		filter := bson.M{"user_id": userID}
		update := bson.M{"$push": bson.M{"address": address}}

		_, err := app.UserCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add address"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"message": "Address added successfully", "address_id": address.Address_ID})
	}
}

func EditAddress(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var address models.Address
		if err := c.ShouldBindBodyWithJSON(&address); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid address body"})
			return
		}
		if errs := utils.ValidateStruct(address); errs != nil {
			c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
			return
		}

		addressID := c.Param("id")
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		filter := bson.M{
			"user_id":            userID,
			"address.address_id": addressID,
		}

		update := bson.M{
			"$set": bson.M{
				"address.$.house":      address.House,
				"address.$.street":     address.Street,
				"address.$.city":       address.City,
				"address.$.pincode":    address.Pincode,
				"address.$.updated_at": time.Now(),
			},
		}

		res, err := app.UserCollection.UpdateOne(ctx, filter, update)
		if err != nil || res.MatchedCount == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "address not found or update failed"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Address updated successfully"})
	}
}

func DeleteAddress(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		addressID := c.Param("id")
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		filter := bson.M{"user_id": userID}
		update := bson.M{"$pull": bson.M{"address": bson.M{"address_id": addressID}}}

		res, err := app.UserCollection.UpdateOne(ctx, filter, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete address"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Address deleted successfully", "matched_count": res.MatchedCount})
	}
}

func GetAllAddresses(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		filter := bson.M{"user_id": userID}
		var user models.User

		err := app.UserCollection.FindOne(ctx, filter).Decode(&user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch addresses"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"addresses": user.Address_Details})
	}
}

func GetAddressByID(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		addressID := c.Param("id")
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		filter := bson.M{
			"user_id": userID,
			"address": bson.M{
				"$elemMatch": bson.M{"address_id": addressID},
			},
		}

		var user models.User
		err := app.UserCollection.FindOne(ctx, filter).Decode(&user)
		if err != nil {
			if err.Error() == "mongo: no documents in result" {
				c.JSON(http.StatusNotFound, gin.H{"error": "address not found"})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch address"})
			}
			return
		}
		for _, address := range user.Address_Details {
			if address.Address_ID == addressID {
				c.JSON(http.StatusOK, gin.H{"message": "fetched user address successfully", "address": address})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "address not found"})
	}
}
