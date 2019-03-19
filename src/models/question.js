// Model for Question
const mongoose = require('mongoose')

const QSchema = new mongoose.Schema({
			question: String,
			author: String
},
{collection: 'Questions'});

module.exports = mongoose.model('question', QSchema)