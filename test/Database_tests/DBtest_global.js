// This file has global settings for Mocha that are valid for all tests on every test-file.
var models = require("../../src/models/models");

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//Settings for MongoDB Atlas
var user = "pwp",
	pw = "rest",
	collection = "FAQ";

//Establish a connection to MongoDB. Done once and first before any tests.
before(done => {
	mongoose.connect("mongodb+srv://" + user + ":" + pw + "@cluster-uj4xd.mongodb.net/" + collection + "?retryWrites=true", { useNewUrlParser: true });
	mongoose.connection
		.once("open", () => {
			done();
		})
		.on("error", error => {
			console.warn("Error", error);
		});
});

//Before each test, in every file, Questions -collection is destroyed for a fresh test. For a production version this would not be acceptable.
beforeEach(done => {
	mongoose.connection.db.listCollections({ name: "Questions" }).next(function(err, exists) {
		if (exists) {
			mongoose.connection.dropCollection("Questions", (error, result) => {
				if (error) {
					console.warn("Error, Could not delete!", error);
				} else {
					done();
				}
			});
		}
	});
});

beforeEach(done => {
	let q2;
	// for every test, in every file, a question is created
	q2 = new models.Question({ question: "test question2", author: "testbot2" });
	q2.save().then(() => done());
});
