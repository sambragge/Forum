package models

import (
	"log"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// Post Data Model
type Post struct {
	ID        bson.ObjectId   `json:"_id" bson:"_id"`
	ParentID  bson.ObjectId   `json:"_parent" bson:"_parent"`
	Title     string          `json:"title" bson:"title"`
	Content   string          `json:"content" bson:"content"`
	CreatorID bson.ObjectId   `json:"_creator" bson:"_creator"`
	Likes     []bson.ObjectId `json:"_likes" bson:"_likes"`
	CreatedAt time.Time       `json:"_createdAt" bson:"_createdAt"`
	UpdatedAt time.Time       `json:"_updatedAt" bson:"_updatedAt"`
	// Populated Fields
	Creator  User       `json:"creator,omitempty" bson:"-"`
	Comments []*Comment `json:"comments,omitempty" bson:"-"`
	Parent   *Forum     `json:"parent" bson:"-"`
}

// Sync : use bson.ObjectId to generate the rest of the model
func (p *Post) Sync(_posts *mgo.Collection) error {
	err := _posts.FindId(p.ID).One(&p)
	return err
}

// Populate : populate fields
func (p *Post) Populate(_forums, _users, _comments *mgo.Collection) {
	if err := _users.Find(bson.M{"_id": p.CreatorID}).One(&p.Creator); err != nil {
		log.Fatal("Fata Error getting user in Post Populate", err.Error())
	}
	if err := _forums.FindId(p.ParentID).One(&p.Parent); err != nil {
		log.Fatal("Fata Error getting parent in Post Populate", err.Error())
	}
	if err := _comments.Find(bson.M{"_parent": p.ID}).All(&p.Comments); err != nil {
		log.Fatal("Fata Error getting comments in Post Populate", err.Error())
	}
	if len(p.Comments) > 0 {
		for _, comment := range p.Comments {
			comment.Populate(_users)
		}
	}
}

// Delete : delete forum from the database
func (p *Post) Delete(_posts, _comments *mgo.Collection) error {
	var children []*Comment
	if err := _posts.RemoveId(p.ID); err != nil {
		return err
	}
	if err := _comments.Find(bson.M{"_parent": p.ID}).All(&children); err != nil {
		return err
	}
	for _, comment := range children {
		if err := comment.Delete(_comments); err != nil {
			return err
		}
	}
	return nil
}

// Validate : pre save validation
func (p *Post) validate() []string {
	errors := make([]string, 0)
	if p.Title == "" {
		errors = append(errors, "Title is required.")
	}
	if p.Content == "" {
		errors = append(errors, "Content is required.")
	}

	if len(errors) > 0 {
		return errors
	}
	return nil
}

// Update : updates a posts info
func (p *Post) Update(_posts *mgo.Collection) []string {
	if errors := p.validate(); errors != nil {
		return errors
	}
	query := bson.M{"_id": p.ID}
	change := bson.M{"$set": bson.M{"title": p.Title, "content": p.Content}}

	if err := _posts.Update(query, change); err != nil {
		return []string{"Error updating post", err.Error()}
	}
	return nil

}

// PreSave : anything that needs to happen before model is saved to the database
func (p *Post) preSave() {
	p.ID = bson.NewObjectId()
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
}

// Save : save data model to the database
func (p *Post) Save(_posts *mgo.Collection) []string {
	if errors := p.validate(); errors != nil {
		return errors
	}

	p.preSave()

	if err := _posts.Insert(p); err != nil {
		return []string{"Error saving forum post to database", err.Error()}
	}

	return nil
}
