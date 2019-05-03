const assert = require("assert");
const models = require("../../../src/models/models");

describe("DB Test | Deleting an answer instance", () => {
	//Test to delete an instance:
	it("DB Test | Delete an existing instance", done => {
		models.Answer.findOneAndRemove({ answer: "test answer2" })
			.then(() => models.Answer.findOne({ answer: "test answer2" }))
			.then(answer => {
				assert(answer === null); //lets check it wont be found.
				done();
			});
	});

	// Lets try to delete something, that doesn't exist. Test passes if error occurs.
	it("DB Test | Delete non-existing answer instance", done => {
		models.Answer.findOneAndRemove({ answer: "Doesn't exist" }, (err, result) => {
			if (result != null) throw err;
			done();
		});
	});
});
