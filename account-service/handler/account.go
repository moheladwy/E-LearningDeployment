package handler

import (
	"errors"
	"fmt"
	"strings"

	"account-service/database"
	model "account-service/models"
	"account-service/services"

	"github.com/gofiber/fiber/v2"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

type AccountData struct {
	Username          string `json:"username"`
	Name              string `json:"name"`
	Email             string `json:"email"`
	Affiliation       string `json:"affiliation"`
	Bio               string `json:"bio"`
	YearsOfExperience int    `json:"yoe"`
	Role              string `json:"role"`
}

type JwtToken struct {
	Name  string `json:"name"`
	Value string `json:"token"`
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 8)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GetJwtTokenFromHeader(cookieStr string) (string, error) {
	cookies := make(map[string]string)
	for _, cookie := range strings.Split(cookieStr, ";") {
		parts := strings.SplitN(cookie, "=", 2)
		if len(parts) == 2 {
			cookies[parts[0]] = parts[1]
		}
	}

	if cookies["jwt"] == "" {
		return "", errors.New("empty token body")
	}
	return cookies["jwt"], nil

}

func Login(c *fiber.Ctx) error {
	type LoginInput struct {
		Identifier string `json:"identifier"`
		Password   string `json:"password"`
	}

	type TokenData struct {
		ID       int64
		Password string
		Role     string
	}

	var request = LoginInput{}
	err := c.BodyParser(&request)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Failed to parse request")
	}

	db := database.DB
	stmt, err := db.Prepare(`SELECT id, role, password FROM Account WHERE username = ? OR email = ?`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}
	defer stmt.Close()

	account := TokenData{}
	err = stmt.QueryRow(request.Identifier, request.Identifier).Scan(
		&account.ID,
		&account.Role,
		&account.Password,
	)

	if err != nil {
		// fmt.Println(err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON("User not found")
	}

	passValid := CheckPasswordHash(request.Password, account.Password)
	if !passValid {
		return c.Status(fiber.StatusForbidden).JSON("Invalid password or username")
	}

	token, err := services.NewAccessToken(account.ID, account.Role)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error creating access token")
	}

	cookie := JwtToken{
		Name:  "jwt",
		Value: token,
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"cookie": cookie})
}

func AddUser(c *fiber.Ctx) error {

	var account = model.Account{}
	err := c.BodyParser(&account)
	if err != nil {
		return c.JSON("Error parsing account")
	}

	db := database.DB
	stmt, err := db.Prepare(`INSERT INTO Account (username, name, password, email, affiliation, bio, yoe, role)
	VALUES (?,?,?,?,?,?,?,?)`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}
	defer stmt.Close()

	account.Password, err = HashPassword(account.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}

	if strings.ToLower(account.Role) == "student" {
		account.YearsOfExperience = -1
	}

	_, err = stmt.Exec(account.Username, account.Name, account.Password, account.Email, account.Affiliation, account.Bio, account.YearsOfExperience, account.Role)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error adding account, try a different username or email")
	}

	return c.JSON("Account successfully created!")
}

func GetAllUsers(c *fiber.Ctx) error {

	token := c.Request().Header.Peek("jwt")

	claims, err := services.VerifyToken(string(token))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}

	if claims.Role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON("Not authorized")
	}

	db := database.DB
	stmt, err := db.Prepare(`SELECT * FROM Account`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}
	defer stmt.Close()

	rows, err := stmt.Query()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error executing query")
	}
	defer rows.Close()

	var accounts []model.Account
	for rows.Next() {
		var account model.Account
		err := rows.Scan(
			&account.ID,
			&account.Username,
			&account.Name,
			&account.Password,
			&account.Email,
			&account.Affiliation,
			&account.Bio,
			&account.YearsOfExperience,
			&account.Role,
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
		}
		accounts = append(accounts, account)
	}

	return c.JSON(accounts)
}

func GetUserById(c *fiber.Ctx) error {

	id := c.Params("id")

	db := database.DB
	stmt, err := db.Prepare(`SELECT username, name, email, affiliation, bio, yoe, role FROM Account WHERE id = ?`)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON("Error processing request")
	}
	defer stmt.Close()

	var account = AccountData{}
	err = stmt.QueryRow(id).Scan(
		&account.Username,
		&account.Name,
		&account.Email,
		&account.Affiliation,
		&account.Bio,
		&account.YearsOfExperience,
		&account.Role,
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Invalid user id")
	}

	return c.JSON(account)
}

func ChangePassword(c *fiber.Ctx) error {

	token := c.Request().Header.Peek("jwt")
	if token == nil {
		return c.Status(fiber.StatusBadRequest).JSON("Invalid user id")
	}

	payload, err := services.VerifyToken(string(token))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON("Invalid user id")
	}

	if payload.Role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON("Not authorized")
	}

	var obj map[string]string
	err = c.BodyParser(&obj)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error parsing fields")
	}

	newPassword, err := HashPassword(obj["password"])
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}

	db := database.DB
	stmt, err := db.Prepare("UPDATE Account SET password = ? WHERE id = ?")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON("Error processing request")
	}
	result, err := stmt.Exec(newPassword, obj["id"])
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON("Invalid user id")
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error parsing rows")
	}
	if rowsAffected == 0 {
		return c.JSON("Account not found!")
	} else {
		return c.JSON("Password updated successfully!")
	}
}

func UpdateUser(c *fiber.Ctx) error {

	token := c.Request().Header.Peek("jwt")
	if token == nil {
		return c.Status(fiber.StatusForbidden).JSON("Not authorized")
	}

	claims, err := services.VerifyToken(string(token))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Failed to verify token")
	}

	if claims.Role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON("Not authorized")
	}

	var account = model.Account{}
	err = c.BodyParser(&account)
	if err != nil {
		fmt.Println(err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON("Error parsing fields")
	}

	db := database.DB
	stmt, err := db.Prepare(`
		UPDATE Account
		SET username = ?, name = ?, email = ?, affiliation = ?, bio = ?, yoe = ?, role = ?
		WHERE id = ?`)
	if err != nil {
		fmt.Println(err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}
	defer stmt.Close()

	result, err := stmt.Exec(account.Username, account.Name, account.Email, account.Affiliation, account.Bio, account.YearsOfExperience, account.Role, account.ID)
	if err != nil {
		fmt.Println(err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON("Error updating account details")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		fmt.Println(err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}

	if rowsAffected > 0 {
		return c.JSON("Account details updated successfully!")
	}
	fmt.Println(account)
	return c.Status(fiber.StatusInternalServerError).JSON("Account doesn't exist")
}

func AccountStats(c *fiber.Ctx) error {

	token := c.Request().Header.Peek("jwt")

	claims, err := services.VerifyToken(string(token))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}

	if claims.Role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON("Not authorized")
	}

	db := database.DB
	stmt, err := db.Prepare(`SELECT COUNT(*) FROM Account WHERE LOWER(role) = 'student'`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}
	defer stmt.Close()

	var studentCount int
	err = stmt.QueryRow().Scan(&studentCount)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}

	stmt, err = db.Prepare(`SELECT COUNT(*) FROM Account WHERE LOWER(role) = 'instructor'`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}
	defer stmt.Close()

	var instructorCount int
	err = stmt.QueryRow().Scan(&instructorCount)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}

	stmt, err = db.Prepare(`SELECT COUNT(*) FROM Account WHERE LOWER(role) = 'admin'`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}
	defer stmt.Close()

	var adminCount int
	err = stmt.QueryRow().Scan(&adminCount)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}

	return c.JSON(fiber.Map{
		"students":    studentCount,
		"instructors": instructorCount,
		"admins":      adminCount,
	})

}

func DeleteUser(c *fiber.Ctx) error {

	token := c.Request().Header.Peek("jwt")

	claims, err := services.VerifyToken(string(token))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}

	if claims.Role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON("Not authorized")
	}

	id := c.Params("id")

	db := database.DB
	stmt, err := db.Prepare(`DELETE FROM Account WHERE id = ?`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}
	defer stmt.Close()

	result, err := stmt.Exec(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON("Error processing request")
	}

	if rowsAffected > 0 {
		return c.JSON("Account deleted successfully!")
	}
	return c.Status(fiber.StatusInternalServerError).JSON("Account doesn't exist")
}
