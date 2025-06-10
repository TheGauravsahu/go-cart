package utils

import (
	"context"
	"errors"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var SECRET_KEY = os.Getenv("SECRET_KEY")

type SignedDetails struct {
	Email     string
	FirstName string
	LastName  string
	UserID    string
	jwt.RegisteredClaims
}

func TokenGenerator(email, firstName, lastName, userID string) (token string, refreshToken string, err error) {
	claims := &SignedDetails{
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
		UserID:    userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // 24 hrs expiry
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	refreshClaims := &SignedDetails{
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
		UserID:    userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * 7 * time.Hour)), // 7 days expiry
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	tokenString, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		return "", "", err
	}
	refreshTokenString, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		return "", "", err
	}
	return tokenString, refreshTokenString, nil
}

func UpdateAllTokens(userCollection *mongo.Collection, token, refreshToken, userID string) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	updatedObj := bson.M{
		"token":        token,
		"refresh_token": refreshToken,
		"updated_at":   time.Now(),
	}

	_, err := userCollection.UpdateOne(
		ctx,
		bson.M{"user_id": userID},
		bson.M{"$set": updatedObj},
	)

	if err != nil {
		log.Panic(err)
	}
}

func ValidateToken(tokenStr string) (*SignedDetails, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &SignedDetails{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(SECRET_KEY), nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*SignedDetails)
	if !ok || !token.Valid || claims.ExpiresAt.Time.Before(time.Now()) {
		return nil, errors.New("invalid token")
	}
	return claims, nil
}
