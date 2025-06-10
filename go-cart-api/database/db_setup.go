package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func ConnectToDb() *mongo.Client {
	MONGO_URI := os.Getenv("MONGODB_URI")
	if MONGO_URI == "" {
		log.Fatal("Mongo URI not provided. Set MONGODB_URI in .env")
	}

	client, err := mongo.Connect(options.Client().ApplyURI(MONGO_URI))
	if err != nil {
		log.Fatal(err)
	}

	_, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		fmt.Println("failed to connect to mongodb!")
		return nil
	}

	fmt.Println("successfully connected to mongodb!")

	return client
}

func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
	return client.Database("go_cart").Collection(collectionName)
}
