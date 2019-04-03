// Model for Question
const mongoose = require("mongoose");

//Schema for answers
const ASchema = new mongoose.Schema(
	{
		answer: String,
		author: String,
		time: {
			type: Date,
			default: Date.now
		},
		question: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Question"
		}
	},
	{
		collection: "Answers"
	}
);

//Schema for questions
const QSchema = new mongoose.Schema(
	{
		question: String,
		author: String,
		time: {
			type: Date,
			default: Date.now
		},
		answers: [
			//Stores id's of the answers and reference to Answer model.
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Answer"
			}
		]
	},
	{
		collection: "Questions"
	}
);

var Question = mongoose.model("Question", QSchema);
var Answer = mongoose.model("Answer", ASchema);

module.exports = {
	Question: Question,
	Answer: Answer
};
