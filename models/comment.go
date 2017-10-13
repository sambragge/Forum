package models

import (
	"log"
	"time"

	"gopkg.in/mgo.v2"

	"gopkg.in/mgo.v2/bson"
)

// Comment Data Model :
type Comment struct {
	ID        bson.ObjectId `json:"_id" bson:"_id"`
	Parent    bson.ObjectId `json:"_parent" bson:"_parent"`
	Content   string        `json:"content" bson:"content"`
	CreatorID bson.ObjectId `json:"_creator" bson:"_creator"`
	CreatedAt time.Time     `json:"_createdAt" bson:"_createdAt"`
	UpdatedAt time.Time     `json:"_updatedAt" bson:"_updatedAt"`
	// Populated Fields
	Creator User `json:"creator,omitempty" bson:"-"`
}

// Sync : uses a bson.ObjectId to generate the rest of the user
func (c *Comment) Sync(_comments *mgo.Collection) error {
	err := _comments.FindId(c.ID).One(&c)
	return err
}

// Delete : delete user from database
func (c *Comment) Delete(_comments *mgo.Collection) error {
	err := _comments.RemoveId(c.ID)
	return err
}

// Populate : populates fields
func (c *Comment) Populate(_users *mgo.Collection) {
	if err := _users.Find(bson.M{"_id": c.CreatorID}).One(&c.Creator); err != nil {
		log.Fatal("Fatal Error getting user in ForumComment Populate", err.Error())
	}
}

// Validate : the pre save validation process
func (c *Comment) validate() []string {
	errors := make([]string, 0)
	if c.Content == "" {
		errors = append(errors, "Cant comment nothing!")
	}
	if len(errors) > 0 {
		return errors
	}
	return nil
}

// PreSave : anything that needs to happen before a validated model enters the database
func (c *Comment) preSave() {
	c.ID = bson.NewObjectId()
	c.CreatedAt = time.Now()
	c.UpdatedAt = time.Now()
}

// Save : save the model to the database, upon passing validation
func (c *Comment) Save(_forumComments *mgo.Collection) []string {

	if errors := c.validate(); errors != nil {
		return errors
	}
	c.preSave()
	if err := _forumComments.Insert(c); err != nil {
		return []string{"Error saving comment to database", err.Error()}
	}
	return nil
}
