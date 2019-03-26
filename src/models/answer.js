// Model for Question
const mongoose = require("mongoose");

//Schema for questions
const ASchema = new mongoose.Schema(
	{
		answer: String,
		author: String,
		time: {
			type: Date,
			default: Date.now
		}
	},
	{
		collection: "Answers"
	}
);

module.exports = mongoose.model("answer", ASchema);
