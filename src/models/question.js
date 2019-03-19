// Model for Question
const mongoose = require('mongoose')

//Schema for questions
const QSchema = new mongoose.Schema({
			question: String,
			author: String,
			time : { type : Date, default: Date.now }
},
{collection: 'Questions'});

module.exports = mongoose.model('question', QSchema)