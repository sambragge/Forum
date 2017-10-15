package controllers

import (
	"crypto/rsa"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"gopkg.in/mgo.v2"

	"gopkg.in/mgo.v2/bson"

	"sambragge/forum/models"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
)

const (
	privKeyPath = "./keys/app.rsa"
	pubKeyPath  = "./keys/app.rsa.pub"
)

// AuthController : handles authentication and json web tokens
type AuthController struct {
	verifyKey *rsa.PublicKey
	signKey   *rsa.PrivateKey
	users     *mgo.Collection
}

// NewAuthController : creates and returns a pointer to a new auth controller
func NewAuthController(db *mgo.Database) *AuthController {
	controller := &AuthController{
		users: db.C("users"),
	}
	controller.initKeys()
	return controller
}

func (ac *AuthController) initKeys() {

	signBytes, err := ioutil.ReadFile(privKeyPath)
	if err != nil {
		log.Fatal(err)
	}

	ac.signKey, err = jwt.ParseRSAPrivateKeyFromPEM(signBytes)
	if err != nil {
		log.Fatal(err)
	}

	verifyBytes, err := ioutil.ReadFile(pubKeyPath)
	if err != nil {
		log.Fatal(err)
	}

	ac.verifyKey, err = jwt.ParseRSAPublicKeyFromPEM(verifyBytes)
	if err != nil {
		log.Fatal(err)
	}
}

func (ac *AuthController) createTokenString(id bson.ObjectId) (string, error) {
	token := jwt.New(jwt.SigningMethodRS256)
	claims := make(jwt.MapClaims)
	// claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	claims["iat"] = time.Now().Unix()
	claims["data"] = id
	token.Claims = claims

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString(ac.signKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// Login : validate credentials and return errors or a token.
func (ac *AuthController) Login(w http.ResponseWriter, r *http.Request) {
	_user := DecodeUser(r.Body)
	user, errors := _user.ValidateLogin(ac.users)
	if errors != nil {
		SendAsJSON(w, false, errors)
		return
	}
	tokenString, err := ac.createTokenString(user.ID)
	if err != nil {
		SendAsJSON(w, false, []string{"Error creating tokenString from id", err.Error()})
		return
	}
	SendAsJSON(w, true, tokenString)
}

// GetUserFromToken : decodes a token string and returns the user associated with the _id inside the token.
func (ac *AuthController) GetUserFromToken(w http.ResponseWriter, r *http.Request) {
	var user *models.User
	data, err := ac.getDataFromToken(mux.Vars(r)["token"])
	if err != nil {
		SendAsJSON(w, false, []string{"Error in GetUserFromToken", err.Error()})
		return
	}
	data = bson.ObjectIdHex(data.(string))
	if err := ac.users.FindId(data).One(&user); err != nil {
		SendAsJSON(w, false, []string{"Error finding user from the token data", err.Error()})
		return
	}
	user.Populate(ac.users)
	SendAsJSON(w, true, user)
}

func (ac *AuthController) getDataFromToken(tokenString string) (interface{}, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, errors.New("Unexpected signing method")
		}
		return ac.verifyKey, nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok && !token.Valid {
		return nil, errors.New("Error Mapping Token Claims")
	}
	return claims["data"], nil

}
