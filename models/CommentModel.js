const express = require('express')
const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    post: {type: mongoose.Schema.Types.ObjectId, required: true},
    comment: {type: String, required: true, minLength: 3, maxLength: 150},
    user: {type: mongoose.Schema.Types.ObjectId, required: true},
    date: {type: Date, required: true},
    likes: {type: Number}
})

module.exports = mongoose.model("Comment", CommentSchema)