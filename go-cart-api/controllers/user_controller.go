package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/TheGauravsahu/go-cart/internal/application"
	"github.com/TheGauravsahu/go-cart/internal/dto"
	"github.com/TheGauravsahu/go-cart/models"
	"github.com/TheGauravsahu/go-cart/utils"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var Validate = validator.New()

func SignUp(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var input dto.SignUpInput
		if err := c.ShouldBindBodyWithJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
			return
		}

		if errs := utils.ValidateStruct(input); errs != nil {
			c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
			return
		}

		// email check
		count, err := app.UserCollection.CountDocuments(ctx, bson.M{"email": input.Email})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "email already in use"})
			return
		}

		// phone no check
		count, err = app.UserCollection.CountDocuments(ctx, bson.M{"phone": input.Phone})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}
		if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "phone number already in use"})
			return
		}

		// Hash password
		hashedPassword := utils.HashPassword(input.Password)
		userID := primitive.NewObjectID()
		// creating user
		user := models.User{
			ID:              userID,
			First_Name:      input.FirstName,
			Last_Name:       input.LastName,
			Email:           input.Email,
			Password:        hashedPassword,
			Phone:           input.Phone,
			Token:           "",
			Refresh_Token:   "",
			Created_At:      time.Now(),
			Updated_At:      time.Now(),
			User_ID:         userID.Hex(),
			OrderHistory:    []models.Order{},
			Address_Details: []models.Address{},
		}

		token, refreshToken, _ := utils.TokenGenerator(
			user.Email,
			user.First_Name,
			user.Last_Name,
			user.User_ID,
		)

		user.Token = token
		user.Refresh_Token = refreshToken

		_, err = app.UserCollection.InsertOne(ctx, user)
		if err != nil {
			log.Println("Error creating user:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Successfully created the user."})
	}
}

func Login(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var input dto.LoginInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
			return
		}

		if errs := utils.ValidateStruct(input); errs != nil {
			c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
			return
		}

		var foundUser models.User
		err := app.UserCollection.FindOne(ctx, bson.M{"email": input.Email}).Decode(&foundUser)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid email or password"})
			return
		}

		isValid, msg := utils.VerifyPassword(foundUser.Password, input.Password)
		if !isValid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}

		token, refreshToken, _ := utils.TokenGenerator(
			foundUser.Email,
			foundUser.First_Name,
			foundUser.Last_Name,
			foundUser.User_ID,
		)

		utils.UpdateAllTokens(app.UserCollection, token, refreshToken, foundUser.User_ID)
		foundUser.Token = token
		foundUser.Refresh_Token = refreshToken

		foundUser.Password = ""
		id, err := primitive.ObjectIDFromHex(foundUser.User_ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid user id"})
			return
		}
		foundUser.ID = id

		c.JSON(http.StatusOK, gin.H{"message": "Logged in successfully.", "data": gin.H{"user": foundUser}})
	}
}

func GetProfile(app *application.Application) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not get user from context"})
			return
		}

		var user models.User
		err := app.UserCollection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&user)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}

		user.Password = ""
		user.Token = ""
		user.Refresh_Token = ""

		c.JSON(http.StatusOK, user)
	}
}
