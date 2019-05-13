const models = require("../../src/models/models");
const GET_Questions_Schema = require("../../src/schemas/responses").GET_Questions_Schema;

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../src/app.js");
const mongoose = require("mongoose");

chai.use(chaiHttp);
chai.use(require("chai-json-schema"));

after(done => {
	mongoose.models = {};
	mongoose.modelSchemas = {};
	mongoose.connection.close();
	done();
});
/*
 * Test the /GET route for questions
 */
describe("API Test | /api/questions", () => {
	//Tests to get all questions from questions collection. Should give a 200 status code.
	it("API Test | GET all the questions as HAL-FORMS hypermedia response", done => {
		//Test to request all questions.
		chai
			.request(server)
			.get("/api/questions") //sends a GET request to the uri
			.end((err, res) => {
				if (err) {
					console.log(err);
				}
				res.status.should.be.equal(200); //status should be 200
				res.should.have.header("content-type", "application/prs.hal-forms+json; charset=utf-8"); // content-type should be hal+json
				res.body.should.be.jsonSchema(GET_Questions_Schema); //schema should match with the template schema.
				done();
			});
	});
});

describe("API Test | /api/questions/{id}", () => {
	//Gets one question by the id. Returns it with HAL response and statuscode 200
	it("API Test | GET a question by Id as HAL-FORMS hypermedia response", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			//Gets id for a created question.
			if (err) {
				console.log(err);
			}

			chai
				.request(server)
				.get("/api/questions/" + question[0]._id + "/") //sends a GET request to the uri
				.end((err, res) => {
					res.status.should.be.equal(200); //status should be 200
					res.should.have.header("content-type", "application/prs.hal-forms+json; charset=utf-8"); // content-type should be hal+json
					res.body.should.be.jsonSchema(GET_Questions_Schema); //schema should match with the template schema.
					//console.log(res.body);
					done();
				});
		});
	});

	//we have to test what happens if we try to get questions that doesn't exist.
	it("API Test | GET Test id that doesn't exist.", done => {
		chai
			.request(server)
			.get("/api/questions/notexisting/") //sends a GET request to the uri
			.end((err, res) => {
				res.status.should.be.equal(404); //status should be 404
				done();
			});
	});
});

//This testblock is  to test the answers
describe("API Test | /api/questions/{id}/answers/", () => {
	//This should successfully return all answers for one question. Response code 200
	it("API Test | GET all answers for a certain question", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			//Gets id for a created question.
			if (err) {
				console.log(err);
			}
			chai
				.request(server)
				.get("/api/questions/" + question[0]._id + "/answers/") //sends a GET request to the uri
				.end((err, res) => {
					res.status.should.be.equal(200); //status should be 200
					res.should.have.header("content-type", "application/prs.hal-forms+json; charset=utf-8"); // content-type should be hal+json
					res.body.should.be.jsonSchema(GET_Questions_Schema); //schema should match with the template schema.
					done();
				});
		});
	});

	it("API Test | GET one answer for a certain question", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			//Gets id for a created question.
			if (err) {
				console.log(err);
			}
			models.Answer.find({ answer: "test answer2" }, (err, answer) => {
				//Gets id for a created answer.
				if (err) {
					console.log(err);
				}

				chai
					.request(server)
					.get("/api/questions/" + question[0]._id + "/answers/" + answer[0]._id) //sends a GET request to the uri
					.end((err, res) => {
						res.status.should.be.equal(200); //status should be 200
						res.should.have.header("content-type", "application/prs.hal-forms+json; charset=utf-8"); // content-type should be hal+json
						res.body.should.be.jsonSchema(GET_Questions_Schema); //schema should match with the template schema.
						done();
					});
			});
		});
	});

	//Lets test that error is given, when answer doesn't belong to a question which is given:
	it("API Test | Test if answer doesn't belong to question given. Should return error", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			//Gets id for a created question.
			if (err) {
				console.log(err);
			}

			chai
				.request(server)
				.get("/api/questions/" + question[0]._id + "/answers/5ccd7ca31866814fa896a3de") //sends a GET request to the uri
				.end((err, res) => {
					res.status.should.be.equal(404); //status should be 404
					done();
				});
		});
	});

	//And test what if we try to get answer that doesn't exist.
	it("API Test | GET answers for id that doesn't exist", done => {
		chai
			.request(server)
			.get("/api/questions/cant-find-me/answers/") //sends a GET request to the uri
			.end((err, res) => {
				res.status.should.be.equal(404); //status should be 404
				done();
			});
	});
});
