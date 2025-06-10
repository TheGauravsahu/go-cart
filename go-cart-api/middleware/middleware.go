package middleware

import (
	"net/http"
	"strings"

	"github.com/TheGauravsahu/go-cart/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func Authenticate(userCollection *mongo.Collection) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization header missing"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "bearer token missing"})
			c.Abort()
			return
		}

		claims, err := utils.ValidateToken(tokenString)
			if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			c.Abort()
			return
		}

		ctx := c.Request.Context()
		var user struct {
			Token string `bson:"token"`
		}
		err = userCollection.FindOne(ctx, bson.M{"user_id": claims.UserID}).Decode(&user)
		if err != nil || user.Token != tokenString {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "token mismatch"})
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Next()
	}
}
