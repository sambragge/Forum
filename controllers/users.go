package controllers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"sambragge/forum/models"

	"github.com/gorilla/mux"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// UserController : handles the user data model
type UserController struct {
	users    *mgo.Collection
	forums   *mgo.Collection
	posts    *mgo.Collection
	comments *mgo.Collection
}

// NewUserController : creates and returns a pointer to a new user controller
func NewUserController(db *mgo.Database) *UserController {
	return &UserController{
		users:    db.C("users"),
		forums:   db.C("forums"),
		posts:    db.C("posts"),
		comments: db.C("comments"),
	}
}

func (uc *UserController) decode(body io.Reader) *models.User {
	var user models.User
	if err := json.NewDecoder(body).Decode(&user); err != nil {
		log.Fatal("=== Fatal Error in UserController.decode() ===", err)
	}
	return &user
}

// Create : creates a user
func (uc *UserController) Create(w http.ResponseWriter, r *http.Request) {
	user := uc.decode(r.Body)
	if validationErrors := user.Save(uc.users); validationErrors != nil {
		SendAsJSON(w, false, validationErrors)
		return
	}
	SendAsJSON(w, true, user)
}

// GetAll : gets all users
func (uc *UserController) GetAll(w http.ResponseWriter, r *http.Request) {
	users := make([]*models.User, 0)
	if err := uc.users.Find(bson.M{}).All(&users); err != nil {
		SendAsJSON(w, false, []string{"=== error finding all users ===", err.Error()})
		return
	}
	for _, user := range users {
		user.Populate(uc.users)
	}
	SendAsJSON(w, true, users)
}

// GetOne : gets one user
func (uc *UserController) GetOne(w http.ResponseWriter, r *http.Request) {

	user := &models.User{
		ID: bson.ObjectIdHex(mux.Vars(r)["id"]),
	}
	if err := user.Sync(uc.users); err != nil {
		SendAsJSON(w, false, []string{"Could not find that user", err.Error()})
		return
	}
	user.Populate(uc.users)
	SendAsJSON(w, true, user)

}

// UpdateInfo : updates users personal info
func (uc *UserController) UpdateInfo(w http.ResponseWriter, r *http.Request) {
	user := uc.decode(r.Body)
	if err := user.UpdateInfo(uc.users); err != nil {
		SendAsJSON(w, false, []string{"Error updating users personal info: ", err.Error()})
		return
	}
	SendAsJSON(w, true, user.ID)
}

// Delete : deletes a user
func (uc *UserController) Delete(w http.ResponseWriter, r *http.Request) {
	user := &models.User{
		ID: bson.ObjectIdHex(mux.Vars(r)["id"]),
	}
	if errors := user.Delete(uc.users, uc.forums, uc.posts, uc.comments); errors != nil {
		SendAsJSON(w, false, errors)
		return
	}
	SendAsJSON(w, true, user.ID)
}

// Follow : make a connection with another user
func (uc *UserController) Follow(w http.ResponseWriter, r *http.Request) {
	followRequest := DecodeFollowRequest(r.Body)
	var user *models.User
	if err := uc.users.FindId(followRequest.User1).One(&user); err != nil {
		log.Fatal("Fatal Error finding user in Follow method", err.Error())
	}
	if errors := user.Follow(followRequest.User2, uc.users); errors != nil {
		SendAsJSON(w, false, errors)
		return
	}
	user.Populate(uc.users)
	SendAsJSON(w, true, user)

}

// UnFollow : break a connection with another user
func (uc *UserController) UnFollow(w http.ResponseWriter, r *http.Request) {
	followRequest := DecodeFollowRequest(r.Body)
	var user *models.User
	if err := uc.users.FindId(followRequest.User1).One(&user); err != nil {
		log.Fatal("Fatal Error finding user in Follow method", err.Error())
	}
	if errors := user.UnFollow(followRequest.User2, uc.users); errors != nil {
		SendAsJSON(w, false, errors)
		return
	}
	SendAsJSON(w, true, user)
}
