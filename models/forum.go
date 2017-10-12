package models

import (
	"log"
	"time"

	"gopkg.in/mgo.v2"

	"gopkg.in/mgo.v2/bson"
)

// Forum Data Model
type Forum struct {
	ID          bson.ObjectId `json:"_id" bson:"_id"`
	Topic       string        `json:"topic" bson:"topic"`
	Description string        `json:"description" bson:"description"`
	CreatorID   bson.ObjectId `json:"_creator" bson:"_creator"`
	Creator     User          `json:"creator,omitempty" bson:"-"`
	Posts       []*Post       `json:"posts,omitempty" bson:"-"`
	CreatedAt   time.Time     `json:"_createdAt" bson:"_createdAt"`
	UpdatedAt   time.Time     `json:"_updatedAt" bson:"_updatedAt"`
}

// Sync : use bson.ObjectId to generate the rest of the forum
func (f *Forum) Sync(_forums *mgo.Collection) error {
	err := _forums.FindId(f.ID).One(&f)
	return err
}

// Delete : delete forum from the database
func (f *Forum) Delete(_forums, _posts, _comments *mgo.Collection) error {
	var children []*Post
	if err := _forums.RemoveId(f.ID); err != nil {
		return err
	}
	if err := _posts.Find(bson.M{"_parent": f.ID}).All(&children); err != nil {
		return err
	}
	for _, post := range children {
		if err := post.Delete(_posts, _comments); err != nil {
			return err
		}
	}
	return nil
}

// Populate : populate fields
func (f *Forum) Populate(_users, _forumPosts, _forumComments *mgo.Collection) {

	if err := _users.Find(bson.M{"_id": f.CreatorID}).One(&f.Creator); err != nil {
		log.Fatal("Fatal Error getting user in Forum Populate method: ", err.Error())
	}

	if err := _forumPosts.Find(bson.M{"_parent": f.ID}).All(&f.Posts); err != nil {
		log.Fatal("Fatal Error getting posts in Forum Populate method: ", err.Error())
	}

	if len(f.Posts) > 0 {
		for _, post := range f.Posts {
			post.Populate(_users, _forumComments)
		}
	}
}

// Validate : pre save validation
func (f *Forum) validate() []string {
	errors := make([]string, 0)
	if f.Topic == "" {
		errors = append(errors, "Topic is required")
	}
	if f.Description == "" {
		errors = append(errors, "Description is required")
	}

	if len(errors) > 0 {
		return errors
	}

	return nil
}

// PreSave : anything that needs to happen before model is saved to the database
func (f *Forum) preSave() {
	f.ID = bson.NewObjectId()
	f.CreatedAt = time.Now()
	f.UpdatedAt = time.Now()
}

// Save : save data model to database
func (f *Forum) Save(_forums *mgo.Collection) []string {
	if errors := f.validate(); errors != nil {
		return errors
	}

	f.preSave()

	if err := _forums.Insert(f); err != nil {
		return []string{"=== Error saving forum", err.Error()}
	}
	return nil
}

// SayHello : DEBUG
func (f *Forum) SayHello() {
	log.Print("=== START FORUM ===")
	log.Print("ID: ", f.ID)
	log.Print("Topic: ", f.Topic)
	log.Print("Description: ", f.Description)
	log.Print("CreatorID: ", f.CreatorID)
	log.Print("=== END FORUM ===")
}
