package dto

type SignUpInput struct {
	FirstName string `json:"first_name" validate:"required,min=2,max=30"`
	LastName  string `json:"last_name" validate:"required,min=2,max=30"`
	Email      string `json:"email" validate:"required,email"`
	Password   string `json:"password" validate:"required,min=6"`
	Phone      string `json:"phone" validate:"required,len=10"`
}

type LoginInput struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}
