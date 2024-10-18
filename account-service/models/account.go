package models

type Account struct {
	ID                int64  `json:"id"`
	Username          string `json:"username"`
	Name              string `json:"name"`
	Password          string `json:"password"`
	Email             string `json:"email"`
	Affiliation       string `json:"affiliation"`
	Bio               string `json:"bio"`
	YearsOfExperience int    `json:"yearsofexpreience"`
	Role              string `json:"role"`
}
