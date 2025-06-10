package utils

import (
	"strings"

	"github.com/go-playground/validator/v10"
)

func FormatValidationErrors(err error) map[string]string {
	errs := make(map[string]string)
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, e := range validationErrors {
			field := strings.ToLower(e.Field())
			switch e.Tag() {
			case "required":
				errs[field] = field + " is required"
			case "min":
				errs[field] = field + " must be at least " + e.Param() + " character long"
			case "max":
				errs[field] = field + " cannot be longer than " + e.Param() + " characters"
			case "email":
				errs[field] = "invalid email format"
			default:
				errs[field] = " invalid  " + field
			}
		}
	}
	return errs
}

func ValidateStruct(s interface{}) map[string]string {
	validate := validator.New()
	err := validate.Struct(s)
	if err != nil {
		return FormatValidationErrors(err)
	}
	return nil
}
