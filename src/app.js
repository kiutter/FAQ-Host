//Import needed modules:
const mongoose = require("mongoose"),
	express = require("express"),
	app = express(),
	bodyParser = require("body-parser");

// Swagger
var swaggerUi = require("swagger-ui-express"),
	swaggerDocument = require("./docs/swagger.json");

//Import routes:
const routes = require("./routes");

// ********** CREDENTIALS FOR MONGODB ATLAS **********

var user = "pwp",
	pw = "rest",
	collection = "FAQ";
// ***************************************************

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

// Connect to DB
mongoose
	.connect("mongodb+srv://" + user + ":" + pw + "@cluster-uj4xd.mongodb.net/" + collection + "?retryWrites=true", {
		useNewUrlParser: true
	})
	.then(() => console.log("MongoDB connected!"))
	.catch(err => console.log(err));

//Get routes from separate file
app.use("/api", routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Server running and listening for port 1337
const server = async () => {
	try {
		await app.listen(1337);
		console.log("REST API Server running and listening port 1337!");
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};
server();
