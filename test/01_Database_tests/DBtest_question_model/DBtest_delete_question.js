const assert = require("assert");
const models = require("../../../src/models/models");

describe("DB Test | Deleting an instance", () => {
	//Test to delete an instance:
	it("DB Test | Delete an existing instance", done => {
		models.Question.findOneAndRemove({ question: "test question2" })
			.then(() => models.Question.findOne({ question: "test question2" })) //lets check it wont be found.
			.then(question => {
				assert(question === null); //nothing is returned.
				done();
			});
	});

	// Lets try to delete something, that doesn't exist. Test passes if error occurs.
	it("DB Test | Delete non-existing instance", done => {
		models.Question.findOneAndRemove({ question: "Doesn't exist" }, (err, result) => {
			if (result != null) throw err;
			done();
		});
	});
});
