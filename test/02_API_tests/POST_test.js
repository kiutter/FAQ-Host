const models = require("../../src/models/models");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../src/app.js");

chai.use(chaiHttp);
chai.use(require("chai-json-schema"));

/*
 * Testing POST for questions and answers
 */

describe("API Test | /api/questions/", () => {
	//This tests to post a successfull new question.
	it("API Test | POST a new question ", done => {
		let question = {
			// Define a question to be saved
			question: "You fool",
			author: "Mr. T"
		};
		chai
			.request(server)
			.post("/api/questions/") //route
			.send(question)
			.end((err, res) => {
				res.should.have.status(201); //Response should have created -statuscode
				res.should.have.header("content-type", "application/prs.hal-forms+json; charset=utf-8");
				res.body.should.have.property("question").eql(question.question); //check that response returns the question saved
				res.body._links.should.have.property("self"); //check that response returns the self link

				done();
			});
	});

	// this tests what happens if posting an empty question, should return error 406
	it("API Test | POST a question without a question, should return 406 error", done => {
		let question = {
			// Define a question to be saved
			question: "",
			author: "Mr. T"
		};
		chai
			.request(server)
			.post("/api/questions/")
			.send(question)
			.end((err, res) => {
				res.should.have.status(406); //Wrong content type
				done();
			});
	});

	//this tests to post a question with wrong content-type, should be json.
	it("API Test | POST a question with wrong content-type, should give error 415", done => {
		let question; //can be empty body to check only content type
		chai
			.request(server)
			.post("/api/questions/")
			.set("content-type", "text/plain") //LEts try with "text/plain"
			.send(question)
			.end((err, res) => {
				res.should.have.status(415); //Wrong content type status code.
				done();
			});
	});

	//This tests what happens when posting a question that already exists
	it("API Test | POST a question that already exists, should return 406 error", done => {
		let question = {
			// Define a question to be saved
			question: "test question2", //this question was created automatically before the test
			author: "Mr. T"
		};
		chai
			.request(server)
			.post("/api/questions/")
			.send(question)
			.end((err, res) => {
				res.should.have.status(406); //because question already exists, error status 406 should be returned
				done();
			});
	});
});

describe("API Test | /api/questions/{question}/answers", () => {
	//This tests to post a successful new answer.
	it("API Test | POST a new answer for a certain question", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			//find id for a question
			//Gets id for a created question.
			if (err) {
				console.log("oops");
			}
			let answer = {
				// Define an answer to be saved
				answer: "This is a new answer",
				author: "Rocky Balboa"
			};
			chai
				.request(server)
				.post("/api/questions/" + question[0]._id + "/answers/") //route
				.send(answer)
				.end((err, res) => {
					res.should.have.status(201); //Response should have created -statuscode
					res.should.have.header("content-type", "application/prs.hal-forms+json; charset=utf-8");
					res.body.should.have.property("answer").eql(answer.answer); //check that response returns the answer saved
					res.body._links.should.have.property("self"); //check that response returns the self link

					done();
				});
		});
	});

	// this tests what happens if posting an empty answer, should return error 406
	it("API Test | POST an answer without an answer, should return 406 error", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			if (err) {
				console.log(err);
			}
			//find id for a question
			let answer = {
				// Define an answer to be saved
				answer: "",
				author: "Mr. T"
			};
			chai
				.request(server)
				.post("/api/questions/" + question[0]._id + "/answers/")
				.send(answer)
				.end((err, res) => {
					res.should.have.status(406); //Wrong content type
					done();
				});
		});
	});

	//this tests to post an answer with wrong content-type, should be json.
	it("API Test | POST an answer with wrong content-type, should give error 415", done => {
		models.Question.find({ question: "test question2" }, (err, question) => {
			if (err) {
				console.log(err);
			}
			//find id for a question
			let answer; //can be empty body to check only content type
			chai
				.request(server)
				.post("/api/questions/" + question[0]._id + "/answers/")
				.set("content-type", "text/plain") //Lets try with "text/plain"
				.send(answer)
				.end((err, res) => {
					res.should.have.status(415); //Wrong content type status code.
					done();
				});
		});
	});
});
