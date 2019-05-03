var assert = require("assert");
//var expect = require("chai").expect;
//var should = require("chai").should();
var models = require("../../../src/models/models");

//Tests for question creation process:
describe("DB Test | Creating questions", () => {
	//Lets test to create a completely new question to database:

	it("DB Test | Creates a new question", done => {
		var q1 = new models.Question({ question: "test question", author: "testbot" });
		q1.save().then(() => {
			assert(!q1.isNew); //Condition is returned as true, if new question was created (note: isNew returns false, so !q1.isNew = true if question was created)
			done();
		});
	});

	//Lets test an error scenario. question parameter should not be allowed to be empty and thus cause an error:
	it("DB Test | Creates a invalid question and returns error", done => {
		var q1 = new models.Question({ question: "", author: "testbot" });
		q1.save(function(err) {
			if (err) {
				done(); //error was thrown as expected, complete test.
			} else {
				console.warn("Empty question paramater didn't give error!"); // Error if no error was thrown as expected.
			}
		});
	});
});
