var assert = require("assert");
var assert = require("assert");
var models = require("../src/models/models");

//Creates a new question to database, which we can read later.
let q1;
beforeEach(done => {
	q1 = new models.Question({ question: "test question2", author: "testbot2" });
	q1.save().then(() => {
		//lets check it was created:
		assert(!q1.isNew);
		done();
	});
});

//Create a new test for reading the question
describe("Reading a question", () => {
	it("Search question by question-string", done => {
		//actual test
		models.Question.find({ question: "test question2" }, (err, question) => {
			//find the question according to the question string
			if (err) {
				throw err;
			}
			if (question.length === 0) {
				throw new Error("Could not read a question or it doesn't exist!"); //error if the question is not found
			}
			done(); //Error wasn't thrown, so everything went ok.
		});
	});
	//lets test to search for question that doesn't exists. Shouldn't return anything.
	it("Search question that can't be found, shouldn't return anything", done => {
		//actual test
		models.Question.find({ question: "can't find me" }, (err, question) => {
			//find the question according to the question string
			if (err) {
				throw err;
			}
			if (question.length === 0) {
				done(); //test is done, if nothing is returned.
			} else {
				throw new Error("Something was found, this shouldn't happen!!"); //error if the question is found
			}
		});
	});
});
