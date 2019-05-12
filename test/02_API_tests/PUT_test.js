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
 * Testing PUT for answers
 */

describe("API Test | /api/questions/{question}/answers/{answer}", () => {
	//This tests to edit answer succesfully
	it("API Test | PUT a new answer for a certain question", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			//Gets id for a created question.
			if (err) {
				console.log(err);
			}
			models.Answer.find({ answer: "test answer2" }, (err, answer) => {
				let new_answer = {
					// Define an answer to be saved
					answer: "This is a better answer",
					author: "Rocky Balboa"
				};
				chai
					.request(server)
					.put("/api/questions/" + question[0]._id + "/answers/" + answer[0]._id) //route
					.send(new_answer)
					.end((err, res) => {
						res.should.have.status(200); //Response should have OK -statuscode
						res.body.should.have.property("answer").eql(new_answer.answer); //check that response returns the edited question
						res.body._links.should.have.property("self"); //check that response returns the self link

						done();
					});
			});
		});
	});

	// this tests what happens if trying to edit with wrong data, should return error 406
	it("API Test | PUT an answer without an answer, should return 406 error", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			if (err) {
				console.log(err);
			}
			//find id for a question
			models.Answer.find({ answer: "test answer2" }, (err, answer) => {
				if (err) {
					console.log(err);
				}
				let new_answer = {
					author: "Mr. T"
				};
				chai
					.request(server)
					.put("/api/questions/" + question[0]._id + "/answers/" + answer[0]._id)
					.send(new_answer)
					.end((err, res) => {
						res.should.have.status(406); //Wrong content type
						done();
					});
			});
		});
	});

	//this tests to edit an answer with wrong content-type, should be json.
	it("API Test | PUT an answer with wrong content-type, should give error 415", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			if (err) {
				console.log(err);
			}
			//find id for a question
			models.Answer.find({ answer: "test answer2" }, (err, answer) => {
				if (err) {
					console.log(err);
				}
				let new_answer; //can be empty body to check only content type
				chai
					.request(server)
					.put("/api/questions/" + question[0]._id + "/answers/" + answer[0]._id)
					.set("content-type", "text/plain") //Lets try with "text/plain"
					.send(new_answer)
					.end((err, res) => {
						res.should.have.status(415); //Wrong content type status code.
						done();
					});
			});
		});
	});
});
