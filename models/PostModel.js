const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true, minLength: 3, maxLength: 30},
    user: {type: Schema.Types.ObjectId, required: true},
    date: {type: Date, required: true},
    likes: {type: Number},
    content: {type: String, required: true},
    author: {type: String, required: true},
    draft: {type: Boolean, required: true},
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    backgroundColor : {type: String, required: true},
    textColor: {type: String, required: true},
})

module.exports = mongoose.model("Post", PostSchema)