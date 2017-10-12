package main

import (
	"log"
	"net/http"

	"sambragge/theForum/controllers"
	"sambragge/theForum/routes"

	mgo "gopkg.in/mgo.v2"
)

// dsDev for Development and appData for Production
const activeDB string = "dsDev"

func main() {

	// Database
	session, err := mgo.Dial("localhost:27017")
	if err != nil {
		log.Fatal(err)
	}
	defer session.Close()

	// Controllers
	_users := controllers.NewUserController(session.DB(activeDB))
	_forums := controllers.NewForumController(session.DB(activeDB))
	_auth := controllers.NewAuthController(session.DB(activeDB))

	// Server
	router := routes.Router(_users, _forums, _auth)
	server := newServer(router)
	http.Handle("/", server)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./view"))))

	server.start()

}
