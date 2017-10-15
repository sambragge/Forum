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

// ForumController : handles the forum, post and comment data models
type ForumController struct {
	users    *mgo.Collection
	forums   *mgo.Collection
	posts    *mgo.Collection
	comments *mgo.Collection
}

// NewForumController : creates and returns a pointer to a new forum controller
func NewForumController(db *mgo.Database) *ForumController {
	return &ForumController{
		users:    db.C("users"),
		forums:   db.C("forums"),
		posts:    db.C("posts"),
		comments: db.C("comments"),
	}
}

// ===== FORUMS =====\\
func (fc *ForumController) decode(body io.Reader) *models.Forum {
	var forum models.Forum
	if err := json.NewDecoder(body).Decode(&forum); err != nil {
		log.Fatal("=== Fatal Error in ForumController.decode() ===", err)
	}
	forum.SayHello()
	return &forum
}

// GetAll : gets all the forums
func (fc *ForumController) GetAll(w http.ResponseWriter, r *http.Request) {
	forums := make([]*models.Forum, 0)
	if err := fc.forums.Find(bson.M{}).All(&forums); err != nil {
		SendAsJSON(w, false, []string{"Error finding forums", err.Error()})
		return
	}
	for _, forum := range forums {
		forum.Populate(fc.forums, fc.users, fc.posts, fc.comments)
	}
	SendAsJSON(w, true, forums)

}

// GetOne : gets one forum
func (fc *ForumController) GetOne(w http.ResponseWriter, r *http.Request) {
	forum := &models.Forum{
		Topic: mux.Vars(r)["topic"],
	}
	if err := forum.SyncByTopic(fc.forums); err != nil {
		SendAsJSON(w, false, []string{"Error finding forum", err.Error()})
		return
	}
	forum.Populate(fc.forums, fc.users, fc.posts, fc.comments)
	SendAsJSON(w, true, forum)
}

// Update : updates a forums info
func (fc *ForumController) Update(w http.ResponseWriter, r *http.Request) {
	forum := fc.decode(r.Body)
	if errors := forum.Update(fc.forums); errors != nil {
		SendAsJSON(w, false, errors)
		return
	}
	SendAsJSON(w, true, forum.Topic)
}

// Create : creates a new forum
func (fc *ForumController) Create(w http.ResponseWriter, r *http.Request) {
	forum := fc.decode(r.Body)
	if validationErrors := forum.Save(fc.forums); validationErrors != nil {
		SendAsJSON(w, false, validationErrors)
		return
	}
	forum.Populate(fc.forums, fc.users, fc.posts, fc.comments)
	SendAsJSON(w, true, forum)
}

// Delete : deletes a forum
func (fc *ForumController) Delete(w http.ResponseWriter, r *http.Request) {
	forum := &models.Forum{
		ID: bson.ObjectIdHex(mux.Vars(r)["id"]),
	}
	if err := forum.Delete(fc.forums, fc.posts, fc.comments); err != nil {
		SendAsJSON(w, false, []string{"Error deleting forum", err.Error()})
		return
	}
	SendAsJSON(w, true, forum.ID)
}

// ===== POSTS ===== \\
func (fc *ForumController) decodePost(body io.Reader) *models.Post {
	var post models.Post
	if err := json.NewDecoder(body).Decode(&post); err != nil {
		log.Fatal("=== Fatal error in decodePost", err)
	}
	return &post
}

// CreatePost : creates a new post
func (fc *ForumController) CreatePost(w http.ResponseWriter, r *http.Request) {
	post := fc.decodePost(r.Body)
	if validationErrors := post.Save(fc.posts); validationErrors != nil {
		SendAsJSON(w, false, validationErrors)
		return
	}
	SendAsJSON(w, true, post)

}

func (fc *ForumController) UpdatePost(w http.ResponseWriter, r *http.Request) {
	post := fc.decodePost(r.Body)
	if errors := post.Update(fc.posts); errors != nil {
		SendAsJSON(w, false, errors)
		return
	}
	SendAsJSON(w, true, post.ID)
}

// GetPosts : gets all the posts
func (fc *ForumController) GetPosts(w http.ResponseWriter, r *http.Request) {
	log.Print("In GetPosts")
	results := make([]*models.Post, 0)
	if err := fc.posts.Find(bson.M{}).All(&results); err != nil {
		SendAsJSON(w, false, []string{"Error getting all posts", err.Error()})
		return
	}
	for _, post := range results {
		post.Populate(fc.forums, fc.users, fc.comments)
	}
	SendAsJSON(w, true, results)
}

// GetPost : gets one post
func (fc *ForumController) GetPost(w http.ResponseWriter, r *http.Request) {
	post := &models.Post{
		ID: bson.ObjectIdHex(mux.Vars(r)["id"]),
	}
	if err := post.Sync(fc.posts); err != nil {
		SendAsJSON(w, false, []string{"Error getting one post", err.Error()})
		return
	}
	post.Populate(fc.forums, fc.users, fc.comments)
	SendAsJSON(w, true, post)
}

// DeletePost : deletes a post
func (fc *ForumController) DeletePost(w http.ResponseWriter, r *http.Request) {
	post := &models.Post{
		ID: bson.ObjectIdHex(mux.Vars(r)["id"]),
	}
	if err := post.Delete(fc.posts, fc.comments); err != nil {
		SendAsJSON(w, false, []string{"Error deleting post", err.Error()})
		return
	}
	SendAsJSON(w, true, post.ID)
}

// ===== COMMENTS ===== \\
func (fc *ForumController) decodeComment(body io.Reader) *models.Comment {
	var comment models.Comment
	if err := json.NewDecoder(body).Decode(&comment); err != nil {
		log.Fatal("Fatal Error in decodeComment", err.Error())
	}
	return &comment
}

// CreateComment : creates a new comment
func (fc *ForumController) CreateComment(w http.ResponseWriter, r *http.Request) {
	comment := fc.decodeComment(r.Body)
	if validationErrors := comment.Save(fc.comments); validationErrors != nil {
		SendAsJSON(w, false, validationErrors)
		return
	}
	SendAsJSON(w, true, comment)

}

// DeleteComment : deletes a comment
func (fc *ForumController) DeleteComment(w http.ResponseWriter, r *http.Request) {
	comment := &models.Comment{
		ID: bson.ObjectIdHex(mux.Vars(r)["id"]),
	}
	if err := comment.Delete(fc.comments); err != nil {
		SendAsJSON(w, false, []string{err.Error()})
		return
	}
	SendAsJSON(w, true, comment.ID)
}
