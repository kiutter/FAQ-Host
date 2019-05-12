const models = require("../../src/models/models");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../src/app.js");
const mongoose = require("mongoose");
let should = chai.should();

chai.use(chaiHttp);
chai.use(require("chai-json-schema"));

/*
 * Testing DELETING an answer
 */

describe("API Test | /api/questions/{question}/answers/{answer}", () => {
	//This tests to delete an answer succesfully
	it("API Test | DELETE  answer for a certain question", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			//Gets id for a created question.
			if (err) {
				console.log(err);
			}
			models.Answer.find({ answer: "test answer2" }, (err, answer) => {
				if (err) {
					console.log(err);
				}

				//console.log("/api/questions/" + question[0]._id + "/answers/" + answer[0]._id);
				chai
					.request(server)
					.delete("/api/questions/" + question[0]._id + "/answers/" + answer[0]._id) //route
					.end((err, res) => {
						if (err) {
							console.log(err);
						}
						res.should.have.status(200); //Response should have OK -statuscode

						done();
					});
			});
		});
	});

	//This tests to delete an answer that doesn't exist
	it("API Test | DELETE a non-existing answer, returns an error", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			//Gets id for a created question.
			if (err) {
				console.log(err);
			}

			//console.log("/api/questions/" + question[0]._id + "/answers/" + answer[0]._id);
			chai
				.request(server)
				.delete("/api/questions/" + question[0]._id + "/answers/1235469879") //route
				.end((err, res) => {
					if (err) {
						console.log(err);
					}
					res.should.have.status(404); //Response should have 404 Not found -statuscode

					done();
				});
		});
	});

	//This tests if we can delete a question!
	it("API Test | DELETE a question, returns an error", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			//Gets id for a created question.
			if (err) {
				console.log(err);
			}

			//console.log("/api/questions/" + question[0]._id + "/answers/" + answer[0]._id);
			chai
				.request(server)
				.delete("/api/questions/" + question[0]._id) //route
				.end((err, res) => {
					if (err) {
						console.log(err);
					}
					res.should.have.status(404); //Response should have 404 Not found -statuscode

					done();
				});
		});
	});
});
