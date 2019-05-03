const assert = require("assert");
const models = require("../../../src/models/models");

describe("DB Test | Modifying an answer instance", () => {
	//Test to modify an instance:
	it("DB Test | Update answer to something else", done => {
		models.Answer.findOneAndUpdate({ answer: "test answer2" }, { answer: "Stallone" })
			.then(() => models.Answer.find({ answer: "Stallone" })) //Lets see if answer was modified.
			.then(results => {
				assert(results.length === 1); // Finds one answer.
				assert(results[0].answer == "Stallone"); //Expected is the value which returned answer should be.
			})
			.then(() => models.Answer.find({ answer: "test answer2" })) //Lets make sure the old answer doesn't exist
			.then(questions => {
				assert(questions.length === 0); // Shouldn't find anything
				done();
			});
	});
});
