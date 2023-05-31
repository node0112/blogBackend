const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true, minLength: 3, maxLength: 100},
    user: {type: Schema.Types.ObjectId, required: true},
    author: {type: String, required: true},
    date: {type: Date, required: true},
    likes: {type: Number},
    summary: {type: String, required: true, minLength: 5},
    content: {type: String, required: true, minLength: 3},
    draft: {type: Boolean, required: true},
    backgroundColor : {type: String, required: true},
    textColor: {type: String, required: true},
})

PostSchema.index({content: 'text', title: 'text'})

module.exports = mongoose.model("Post", PostSchema)