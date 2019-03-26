// Model for Question
const mongoose = require("mongoose");
const ASchema = require("./answer").ASchema;
//Schema for questions
const QSchema = new mongoose.Schema(
	{
		question: String,
		author: String,
		time: {
			type: Date,
			default: Date.now
		},
		answer: {
			type: [ASchema]
		}
	},
	{
		collection: "Questions"
	}
);

module.exports = mongoose.model("question", QSchema);
