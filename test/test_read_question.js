var assert = require("assert");
var assert = require("assert");
var expect = require("chai").expect;
var should = require("chai").should();
var models = require("../src/models/models");

let q1;
beforeEach(done => {
	q1 = new models.Question({ question: "test question2", author: "testbot2" });
	q1.save().then(() => {
		assert(!q1.isNew);
		done();
	});
});

describe("Reading the question", () => {
	it("Looks if the question exists", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			if (err) {
				throw err;
			}
			if (question.length === 0) {
				throw new Error("Question wasn not created!");
			}
			done();
		});
	});
});
