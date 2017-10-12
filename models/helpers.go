package models

import "gopkg.in/mgo.v2/bson"

// IDInSlice : im probly going to delete this soon
func IDInSlice(id bson.ObjectId, slice []bson.ObjectId) bool {
	for _, v := range slice {
		if v == id {
			return true
		}
	}
	return false
}
