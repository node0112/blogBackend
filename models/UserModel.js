const express = require('express')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, minLength: 3, maxLength: 30},
    username: {type: String, required: true, minLength: 3, maxLength: 30},
    password: {type: String, required: true, minLength: 6},
})

module.exports = mongoose.model("User", UserSchema)