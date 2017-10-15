package routes

import (
	"net/http"

	"sambragge/forum/controllers"

	"github.com/gorilla/mux"
)

const (
	post   = "POST"
	get    = "GET"
	delete = "DELETE"
	put    = "PUT"
)

func serveView(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./view/index.html")
}

// Router : handles incomming requests and routes them to the proper handler
func Router(_users *controllers.UserController, _forums *controllers.ForumController, _auth *controllers.AuthController) *mux.Router {

	r := mux.NewRouter()

	// Users
	r.Methods(get).Path("/api-users/").HandlerFunc(_users.GetAll)
	r.Methods(post).Path("/api-users/").HandlerFunc(_users.Create)
	r.Methods(get).Path("/api-users/{id}").HandlerFunc(_users.GetOne)
	r.Methods(delete).Path("/api-users/{id}").HandlerFunc(_users.Delete)
	r.Methods(post).Path("/api-users/follow").HandlerFunc(_users.Follow)
	r.Methods(post).Path("/api-users/unfollow").HandlerFunc(_users.UnFollow)
	r.Methods(post).Path("/api-users/update").HandlerFunc(_users.UpdateInfo)

	//Forums
	r.Methods(get).Path("/api-forums/").HandlerFunc(_forums.GetAll)
	r.Methods(post).Path("/api-forums/").HandlerFunc(_forums.Create)
	r.Methods(get).Path("/api-forums/{topic}").HandlerFunc(_forums.GetOne)
	r.Methods(delete).Path("/api-forums/{id}").HandlerFunc(_forums.Delete)
	r.Methods(post).Path("/api-forums/update").HandlerFunc(_forums.Update)

	// Posts
	r.Methods(get).Path("/api-posts/").HandlerFunc(_forums.GetPosts)
	r.Methods(post).Path("/api-posts/").HandlerFunc(_forums.CreatePost)
	r.Methods(get).Path("/api-posts/{id}").HandlerFunc(_forums.GetPost)
	r.Methods(delete).Path("/api-posts/{id}").HandlerFunc(_forums.DeletePost)
	r.Methods(post).Path("/api-posts/update").HandlerFunc(_forums.UpdatePost)

	// Comments
	r.Methods(post).Path("/api-comments/").HandlerFunc(_forums.CreateComment)
	r.Methods(delete).Path("/api-comments/{id}").HandlerFunc(_forums.DeleteComment)

	// Auth
	r.Methods(post).Path("/api-auth/").HandlerFunc(_auth.Login)
	r.Methods(get).Path("/api-auth/{token}").HandlerFunc(_auth.GetUserFromToken)

	// Views / Bounceback Routes
	r.HandleFunc("/", serveView).Methods(get)
	r.HandleFunc("/blog", serveView).Methods(get)
	r.HandleFunc("/about", serveView).Methods(get)
	r.HandleFunc("/forums", serveView).Methods(get)
	r.HandleFunc("/forums/create", serveView).Methods(get)
	r.HandleFunc("/forum/{id}", serveView).Methods(get)
	r.HandleFunc("/post/{id}", serveView).Methods(get)
	r.HandleFunc("/profile/{id}", serveView).Methods(get)
	r.HandleFunc("/login", serveView).Methods(get)
	r.HandleFunc("/register", serveView).Methods(get)
	r.HandleFunc("/user/{id}/edit", serveView).Methods(get)
	r.HandleFunc("/forum/{id}/edit", serveView).Methods(get)
	r.HandleFunc("/post/{id}/edit", serveView).Methods(get)
	r.HandleFunc("/comment/{id}/edit", serveView).Methods(get)

	return r
}
