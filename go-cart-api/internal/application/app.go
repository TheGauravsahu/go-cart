package application

import "go.mongodb.org/mongo-driver/v2/mongo"

type Application struct {
	ProductCollection *mongo.Collection
	UserCollection    *mongo.Collection
	OrderCollection   *mongo.Collection
	ReviewCollection  *mongo.Collection
}

func NewApplication(productCollection *mongo.Collection, userCollection *mongo.Collection, orderCollection *mongo.Collection, reviewCollection *mongo.Collection) *Application {
	return &Application{
		ProductCollection: productCollection,
		UserCollection:    userCollection,
		OrderCollection:   orderCollection,
		ReviewCollection:  reviewCollection,
	}
}
