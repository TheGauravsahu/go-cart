package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID              primitive.ObjectID `json:"id" bson:"_id"`
	First_Name      string             `json:"first_name" validate:"required,min=2,max=30"`
	Last_Name       string             `json:"last_name" validate:"required,min=2,max=30"`
	Password        string             `json:"password" validate:"required,min=6"`
	Email           string             `json:"email" validate:"email,required"`
	Phone           string             `json:"phone" validate:"required,min=10"`
	Token           string             `json:"token"`
	Refresh_Token   string             `json:"refresh_token"`
	Created_At      time.Time          `json:"created_at"`
	Updated_At       time.Time          `json:"updated_at"`
	User_ID         string             `json:"user_id"`
	OrderHistory    []Order            `json:"orders" bson:"orders"`
	Address_Details []Address          `json:"address" bson:"address"`
}

type Product struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string             `bson:"name" json:"name" validate:"required,min=2,max=100"`
	Description string             `bson:"description" json:"description" validate:"required,min=10"`
	Price       float64            `bson:"price" json:"price" validate:"required,gt=0"`
	Category    string             `bson:"category" json:"category" validate:"required"`
	Image       string             `bson:"image" json:"image" validate:"required,url"`
	Rating      float64            `bson:"rating" json:"rating"`
	Stock       int                `bson:"stock" json:"stock" validate:"gte=0"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updated_at"`
	Details     *ProductDetails    `bson:"details,omitempty" json:"details,omitempty"`
}

type ProductDetails struct {
	Weight   string   `bson:"weight,omitempty" json:"weight,omitempty"`
	Material string   `bson:"material,omitempty" json:"material,omitempty"`
	Fabric   string   `bson:"fabric,omitempty" json:"fabric,omitempty"`
	Sizes    []string `bson:"sizes,omitempty" json:"sizes,omitempty"`
	Color    string   `bson:"color,omitempty" json:"color,omitempty"`
	Gender   string   `bson:"gender,omitempty" json:"gender,omitempty"` // Unisex, Male, Female
}

type CartItem struct {
	ProductID primitive.ObjectID `bson:"product_id" json:"product_id"`
	Name      string             `bson:"name" json:"name"`
	Price     float64            `bson:"price" json:"price"`
	Image     string             `bson:"image" json:"image"`
	Quantity  int                `bson:"quantity" json:"quantity"`
}

type Address struct {
	Address_ID string    `json:"address_id" bson:"address_id"`
	House      string    `json:"house_name" bson:"house_name" validate:"required"`
	Street     string    `json:"street_name" bson:"street_name" validate:"required"`
	City       string    `json:"city_name" bson:"city_name" validate:"required"`
	Pincode    string    `json:"pincode" bson:"pincode" validate:"required,len=6"`
	CreatedAt  time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt  time.Time `bson:"updated_at" json:"updated_at"`
}

type Order struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID          string             `bson:"user_id" json:"user_id"`
	Items           []CartItem         `bson:"items" json:"items"`
	TotalPrice      float64            `bson:"total_price" json:"total_price"`
	Discount        float64            `bson:"discount" json:"discount"`
	OrderedAt       time.Time          `bson:"ordered_at" json:"ordered_at"`
	Status          string             `bson:"status" json:"status"` // e.g., pending, shipped
	ShippingAddress Address            `bson:"shipping_address" json:"shipping_address"`
	PaymentMethod   Payment            `bson:"payment_method" json:"payment_method"`
	Notes           string             `bson:"notes,omitempty" json:"notes,omitempty"`
	IsPaid          bool               `bson:"is_paid" json:"is_paid"`
}

type Payment struct {
	Method        string `bson:"method" json:"method"`
	Status        string `bson:"status" json:"status"`
	TransactionID string `bson:"transaction_id" json:"transaction_id,omitempty"`
}

type Review struct {
	ID        primitive.ObjectID `bson:"_id" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id,omitempty" json:"user_id"`
	ProductID primitive.ObjectID `bson:"product_id,omitempty" json:"product_id"`
	Rating    int                `bson:"rating" json:"rating"`
	Comment   string             `bson:"comment" json:"comment"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}
