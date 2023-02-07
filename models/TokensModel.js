const express = require('express')
const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
    refreshToken : {type: String, required: true},
    accessToken: {type:String, required: true}
})

module.exports = mongoose.model("TokenSchema", TokenSchema)