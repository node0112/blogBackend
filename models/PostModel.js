const express = require('express')
const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true, minLength: 3, maxLength: 30},
    user: {type: mongoose.Schema.Types.ObjectId, required: true},
    date: {type: Date, required: true},
    likes: {type: Number},
    content: {type: String, required: true},
    draft: {type: Boolean, required: true}
})

module.exports = mongoose.model("Post", PostSchema)