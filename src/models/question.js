// Model for Question
const mongoose = require('mongoose')

const QSchema = new mongoose.Schema({
  question: String,
  author: String,
  date: String
})

module.exports = mongoose.model('Question', QSchema)