package controllers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"gopkg.in/mgo.v2/bson"

	"sambragge/forum/models"
)

type standardResponse struct {
	Success bool        `json:"success"`
	Payload interface{} `json:"payload"`
}

type FollowRequest struct {
	User1 bson.ObjectId `json:"user1"`
	User2 bson.ObjectId `json:"user2"`
}

func DecodeFollowRequest(body io.Reader) *FollowRequest {
	var results *FollowRequest
	if err := json.NewDecoder(body).Decode(&results); err != nil {
		log.Fatal("Fatal Error decoding follow request", err.Error())
	}
	return results
}

func SendAsJSON(w http.ResponseWriter, success bool, payload interface{}) {
	_response := standardResponse{
		Success: success,
		Payload: payload,
	}
	response, err := json.Marshal(_response)
	if err != nil {
		log.Fatal("Fatal error marshalling response", err.Error())
	}
	w.Write([]byte(response))
}

func DecodeUser(body io.Reader) *models.User {
	var user *models.User
	if err := json.NewDecoder(body).Decode(&user); err != nil {
		log.Fatal("=== Fatal Error in UserController.decode() ===", err)
	}
	return user
}
