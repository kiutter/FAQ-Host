// Model for Question
const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

//Schema for answers
const ASchema = new mongoose.Schema(
	{
		answer: { type: String, unique: true, required: true, dropDups: true },
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
ASchema.plugin(uniqueValidator);

//Schema for questions
const QSchema = new mongoose.Schema(
	{
		question: { type: String, unique: true, required: true, dropDups: true },
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
QSchema.plugin(uniqueValidator);

var Question = mongoose.model("Question", QSchema);
var Answer = mongoose.model("Answer", ASchema);

module.exports = {
	Question: Question,
	Answer: Answer
};
