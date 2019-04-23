var assert = require("assert");
var expect = require("chai").expect;
var should = require("chai").should();
var models = require("../src/models/models");

describe("Creating questions", () => {
	it("Saves a new question", done => {
		var q1 = new models.Question({ question: "test question", author: "testbot" });
		q1.save().then(() => {
			assert(!q1.isNew);
			done();
		});
	});
	it("Creates a invalid question and returns error", done => {
		var q1 = new models.Question({ question: "", author: "testbot" });
		q1.save(function(err) {
			if (err) {
				done();
			} else {
				console.log("This should give an error!!!");
				done(err);
			}
		});
	});
});
