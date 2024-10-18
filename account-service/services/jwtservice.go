package services

import (
	"errors"
	"fmt"

	jwt "github.com/golang-jwt/jwt/v5"
)

var secretKey []byte = []byte("very-very-secret-key")

type CustomClaims struct {
	ID   int64  `json:"id"`
	Role string `json:"role"`
}

func NewAccessToken(id int64, role string) (string, error) {
	claims := jwt.MapClaims{
		"id":   id,
		"role": role,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		fmt.Println(err.Error())
		return "Error creating token", err
	}

	return tokenString, nil
}

func VerifyToken(tokenString string) (CustomClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secretKey, nil
	})
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println("Error validating token")
		return CustomClaims{}, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return CustomClaims{}, errors.New("invalid token format")
	}

	payload := CustomClaims{
		ID:   int64(claims["id"].(float64)),
		Role: string(claims["role"].(string)),
	}
	return payload, err
}
