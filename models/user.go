package models

import (
	"errors"
	"fmt"
	"log"
	"regexp"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// Location : the location data we care about
type Location struct {
	State string `json:"state" bson:"state"`
	City  string `json:"city" bson:"city"`
}

//User Data Model
type User struct {
	ID           bson.ObjectId   `json:"_id" bson:"_id"`
	Gender       string          `json:"gender" bson:"gender"`
	Username     string          `json:"username" bson:"username"`
	Email        string          `json:"email" bson:"email"`
	Location     Location        `json:"location" bson:"location"`
	FollowingIDs []bson.ObjectId `json:"_following" bson:"_following"`
	Password     string          `json:"password" bson:"password"`
	CreatedAt    time.Time       `json:"_createdAt" bson:"_createdAt"`
	UpdatedAt    time.Time       `json:"_updatedAt" bson:"_updatedAt"`
	// Client Only ( Ignored by MongoDB )
	Following       []*User `json:"following,omitempty" bson:"-"`
	Followers       []*User `json:"followers,omitempty" bson:"-"`
	ConfirmPassword string  `json:"confirmPassword,omitempty" bson:"_"`
}

// Sync : use bson.ObjectId to generate the rest of the model
func (u *User) Sync(_users *mgo.Collection) error {
	err := _users.FindId(u.ID).One(&u)
	return err
}

// Populate : populate fields
func (u *User) Populate(_users *mgo.Collection) {
	u.Following = make([]*User, 0)

	for _, id := range u.FollowingIDs {
		var user *User
		if err := _users.FindId(id).One(&user); err != nil {
			log.Fatal("Fatal error in user populate method", err.Error())
		}
		u.Following = append(u.Following, user)
	}
	if err := _users.Find(bson.M{"_following": bson.M{"$in": []bson.ObjectId{u.ID}}}).All(&u.Followers); err != nil {
		log.Fatal("Fatal error populating followers array", err.Error())
	}

}

func (u *User) validateUpdateInfo() []string {
	errors := make([]string, 0)
	if u.Location.City == "" {
		errors = append(errors, "City is required!")
	}
	if u.Location.State == "" {
		errors = append(errors, "State is required!")
	}
	if u.Username == "" {
		errors = append(errors, "Username is required!")
	}
	if len(errors) > 0 {
		return errors
	}
	return nil

}

// UpdateInfo : update users firstName, lastName, location
func (u *User) UpdateInfo(_users *mgo.Collection) error {
	if errs := u.validateUpdateInfo(); errs != nil {
		return errors.New(strings.Join(errs, ", "))
	}
	query := bson.M{"_id": u.ID}
	change := bson.M{"$set": bson.M{"username": u.Username, "location": u.Location, "_updatedAt": time.Now()}}
	err := _users.Update(query, change)
	return err
}

// Follow : follow another user
func (u *User) Follow(id bson.ObjectId, _users *mgo.Collection) []string {
	if IDInSlice(id, u.FollowingIDs) {
		return []string{"You are already following that user"}
	}
	u.FollowingIDs = append(u.FollowingIDs, id)
	query := bson.M{"_id": u.ID}
	change := bson.M{"$set": bson.M{"_following": u.FollowingIDs, "_updatedAt": time.Now()}}
	if err := _users.Update(query, change); err != nil {
		return []string{"Error updating user following array", err.Error()}
	}
	return nil
}

// UnFollow : unfollow another user
func (u *User) UnFollow(id bson.ObjectId, _users *mgo.Collection) []string {
	var idx int
	for i, v := range u.FollowingIDs {
		if v == id {
			idx = i
		}
	}
	u.FollowingIDs = append(u.FollowingIDs[:idx], u.FollowingIDs[idx+1:]...)
	u.UpdatedAt = time.Now()
	query := bson.M{"_id": u.ID}
	change := bson.M{"$set": bson.M{"_following": u.FollowingIDs, "_updatedAt": u.UpdatedAt}}
	if err := _users.Update(query, change); err != nil {
		return []string{"Error updating user following array in unFollow", err.Error()}
	}
	return nil
}

// Delete : delete forum from the database
func (u *User) Delete(_users, _forums, _posts, _comments *mgo.Collection) []string {
	query := bson.M{"_creator": u.ID}
	if err := _users.RemoveId(u.ID); err != nil {
		return []string{err.Error()}
	}
	if _, err := _forums.RemoveAll(query); err != nil {
		return []string{err.Error()}
	}
	if _, err := _posts.RemoveAll(query); err != nil {
		return []string{err.Error()}
	}
	if _, err := _comments.RemoveAll(query); err != nil {
		return []string{err.Error()}
	}
	if err := _users.Find(bson.M{"_following": bson.M{"$in": []bson.ObjectId{u.ID}}}).All(&u.Followers); err != nil {
		return []string{err.Error()}
	}
	for _, user := range u.Followers {
		if errors := user.UnFollow(u.ID, _users); errors != nil {
			return errors
		}
	}
	return nil
}

// ValidateLogin : validates a login request
func (u *User) ValidateLogin(_users *mgo.Collection) (*User, []string) {
	fmt.Println("=== Preparing to ValidateLogin with loginCreds as: ", u)
	errors := make([]string, 0)
	if u.Email == "" {
		errors = append(errors, "Email is required")
	}
	if u.Password == "" {
		errors = append(errors, "Password is required")
	}
	if len(errors) > 0 {
		return nil, errors
	}
	var user *User
	if err := _users.Find(bson.M{"email": u.Email}).One(&user); err != nil {
		return nil, []string{"Email does not exist!"}
	}
	if match := user.comparePasswordWith(u.Password); !match {
		return nil, []string{"Incorrect Password!"}
	}
	return user, nil

}

func (u *User) validate(c *mgo.Collection) []string {
	emailRegex, _ := regexp.Compile("(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$)")
	errors := make([]string, 0)
	if u.Gender == "" {
		errors = append(errors, "Gender is required!")
	}
	if u.Username == "" {
		errors = append(errors, "Username is required!")
	}
	if u.Email == "" {
		errors = append(errors, "Email is required!")
	}
	if u.Location.City == "" {
		errors = append(errors, "City is required!")
	}
	if u.Location.State == "" {
		errors = append(errors, "State is required!")
	}
	if string(u.Password) == "" {
		errors = append(errors, "Password is required!")
	}
	if string(u.ConfirmPassword) == "" {
		errors = append(errors, "Confirm password please!")
	}
	if string(u.Password) != string(u.ConfirmPassword) {
		errors = append(errors, "Passwords do not match!")
	}
	if len(errors) > 0 {
		return errors
	}
	if match := emailRegex.Match([]byte(u.Email)); !match {
		errors = append(errors, "Invalid Email")
	}
	if len(u.Password) < 8 {
		errors = append(errors, "Password must be at least 8 characters")
	}
	var _user User
	if err := c.Find(bson.M{"email": u.Email}).One(&_user); err == nil {
		errors = append(errors, "Someone with that email already exists")
	}
	if len(errors) > 0 {
		return errors
	}
	return nil
}

func (u *User) preSave() {
	fmt.Println("in the preSave, location is", u.Location)
	hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Fatal error encrypting password", err.Error())
	}
	u.ID = bson.NewObjectId()
	u.Password = string(hash)
	u.ConfirmPassword = ""
	u.FollowingIDs = make([]bson.ObjectId, 0)
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
}

func (u *User) comparePasswordWith(pw string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(pw))
	return err == nil
}

// Save : save data model to database
func (u *User) Save(c *mgo.Collection) []string {

	if errors := u.validate(c); errors != nil {
		return errors
	}
	u.preSave()
	if err := c.Insert(u); err != nil {
		return []string{"Error saving user to mongo: ", err.Error()}
	}
	return nil
}

// SayHello : DEBUG
func (u *User) SayHello() {
	log.Print("==== START USER ===")
	log.Print("Gender: ", u.Gender)
	log.Print("Username: ", u.Username)
	log.Print("Followers: ", u.Followers)
	log.Print("Following: ", u.Following)
	log.Print("==== END USER ===")
}
