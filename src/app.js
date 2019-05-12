//Import needed modules:
const mongoose = require("mongoose"),
	express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	path = require("path"),
	cors = require("cors");

//Import routes:
const routes = require("./routes");

//Add bodyparser to handle JSON
app.use(bodyParser.json());
app.use(cors());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname + "/static/index.html"));
});
app.use(express.static(__dirname + "/static"));

//Get routes from separate file
app.use("/api/questions", routes);

// Error handling
app.use(function(err, req, res, next) {
	res.status(500).send("Not a valid request!");
});

// ********** CREDENTIALS FOR MONGODB ATLAS **********

var user = "pwp",
	pw = "rest",
	collection = "FAQ";
// ***************************************************

// Connect to DB
mongoose
	.connect("mongodb+srv://" + user + ":" + pw + "@cluster-uj4xd.mongodb.net/" + collection + "?retryWrites=true", {
		useNewUrlParser: true
	})
	.then(() => console.log("MongoDB connected!"))
	.catch(err => console.log(err));

//Server running and listening for port 1337
const server = async () => {
	try {
		await app.listen(process.env.port || 8080);
		console.log("REST API Server running and listening port 8080!");
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};
server();

module.exports = app;
