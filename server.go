package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// Server
type server struct {
	routes *mux.Router
}

func newServer(routes *mux.Router) *server {
	return &server{
		routes: routes,
	}
}

func (s *server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")

	log.Print("Serving route: ", r.URL.Path, " : ", r.Method)

	s.routes.ServeHTTP(w, r)
}

func (s *server) start() {
	const port = ":8000"

	fmt.Println("Server listining on port", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal("Error in listenAndServe: ", err.Error())
	}
}
