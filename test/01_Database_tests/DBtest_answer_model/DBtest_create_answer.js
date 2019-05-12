var assert = require("assert");
//var expect = require("chai").expect;
//var should = require("chai").should();
var models = require("../../../src/models/models");

//Tests for answer creation process:
describe("DB Test | Creating new answers", () => {
	//Lets test to create a completely new answer to database:

	it("DB Test | Creates a new answer", done => {
		var a1 = new models.Answer({ answer: "test answer", author: "testbot" });
		a1.save().then(() => {
			assert(!a1.isNew); //Condition is returned as true, if new answer was created (note: isNew returns false, so !q1.isNew = true if answer was created)
			done();
		});
	});

	//Lets test an error scenario. answer parameter should not be allowed to be empty and thus cause an error:
	it("DB Test | Creates a invalid answer and returns error", done => {
		var a1 = new models.Answer({ answer: "", author: "testbot" });
		a1.save(function(err) {
			if (err) {
				done(); //error was thrown as expected, complete test.
			} else {
				console.warn("Empty answer paramater didn't give error!"); // Error if no error was thrown as expected.
			}
		});
	});
});
