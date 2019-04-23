//This creates the connection for Mocha, which is being used for testing database. For this project, I have only one database
//and collections, instead of a development version.

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var user = "pwp",
	pw = "rest",
	collection = "FAQ";

//Establish a connection to MongoDB
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

//Before each test, Questions -collection is destroyed for a fresh test.
beforeEach(done => {
	mongoose.connection.dropCollection("Questions", (error, result) => {
		if (error) {
			console.warn("Error, Could not delete!", error);
		} else {
			done();
		}
	});
});
