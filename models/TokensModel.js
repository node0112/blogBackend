const express = require('express')
const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
    user: {type: String, required: true},
    refreshToken : {type: String, required: true},
})

module.exports = mongoose.model("TokenSchema", TokenSchema)