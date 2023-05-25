
const mongoose = require('mongoose')

const FactSchema = new mongoose.Schema({
    fact: {type: String, required: true},
    date : {type: Date, required: true},
})

module.exports = mongoose.model("FactSchema", FactSchema)