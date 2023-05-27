
const mongoose = require('mongoose')

const Facts = new mongoose.Schema({
    fact: {type: String, required: true},
    date : {type: Date, required: true},
})

module.exports = mongoose.model("Fact", Facts)