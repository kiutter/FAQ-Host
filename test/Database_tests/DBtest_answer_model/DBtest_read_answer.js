var models = require("../../../src/models/models");

//Create a new test for reading the answer
describe("DB Test | Reading a answer", () => {
	//Creates a new answer to database, which we can read later.

	it("DB Test | Search answer by answer-string", done => {
		//actual test
		models.Answer.findOne({ answer: "test answer2" }, (err, answer) => {
			//find the answer according to the answer string
			if (err) {
				throw err;
			}
			if (answer.length === 0) {
				throw new Error("Could not read a answer or it doesn't exist!"); //error if the answer is not found
			}
			done(); //Error wasn't thrown, so everything went ok.
		});
	});
	//lets test to search for answer that doesn't exists. Shouldn't return anything.
	it("DB Test | Search answer that can't be found, shouldn't return anything", done => {
		//actual test
		models.Answer.find({ answer: "can't find me" }, (err, answer) => {
			//find the answer according to the answer string
			if (err) {
				throw err;
			}
			if (answer.length === 0) {
				done(); //test is done, if nothing is returned.
			} else {
				throw new Error("Something was found, this shouldn't happen!!"); //error if the answer is found
			}
		});
	});
});
