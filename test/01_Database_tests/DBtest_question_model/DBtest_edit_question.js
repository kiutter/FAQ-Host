const assert = require("assert");
const models = require("../../../src/models/models");

describe("DB Test | Modifying an instance", () => {
	//Test to modify an instance:
	it("DB Test | Update question to something else", done => {
		models.Question.findOneAndUpdate({ question: "test question2" }, { question: "Statham" })
			.then(() => models.Question.find({ question: "Statham" })) //Lets see if question was modified.
			.then(questions => {
				assert(questions.length === 1); // Finds one question.
				assert(questions[0].question == "Statham"); //Expected is the value which returned question should be.
			})
			.then(() => models.Question.find({ question: "test question2" })) //Lets make sure the old question doesn't exist
			.then(questions => {
				assert(questions.length === 0); // Shouldn't find anything
				done();
			});
	});
});
