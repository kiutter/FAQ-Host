// Boom module to handle HTTP error responses
const boom = require("boom");
const halson = require("halson");
// The data models
const models = require("../../models/models.js");

// Requests a certain question with the id
exports.getQuestion = async (req, res) => {
	try {
		const id = req.params.id; //get id from URI parameter
		const Question = await models.Question.findById(id); //find question by id
		res.setHeader("Content-Type", "application/hal+json");
		var resource = halson({ question: Question.question, author: Question.author, time: Question.time }).addLink("self", "/questions/" + Question._id); //Add HAL links
		res.send(JSON.stringify(resource));
		return Question;
	} catch (err) {
		throw boom.boomify(err);
	}
};

// Requests all questions available
exports.getQuestions = async (req, res) => {
	try {
		const Questions = await models.Question.find();
		res.setHeader("Content-Type", "application/hal+json");
		var results = [];
		for (var i = 0; i < Questions.length; i++) {
			var resource = halson({ question: Questions[i].question, author: Questions[i].author, time: Questions[i].time })
				.addLink("self", "/questions/" + Questions[i]._id)
				.addLink("answer-for", "/questions/" + Question._id, "/answers/");
			results.push(resource);
		}
		res.send(JSON.stringify(results));
		return Questions;
	} catch (err) {
		throw boom.boomify(err);
	}
};

// Add a new question
exports.addQuestion = async (req, res) => {
	console.log(req.body);
	var AQuestion = await models.Question.create(req.body)
		.then(item => {
			res.send("New question added.");
		})
		.catch(err => {
			res.status(400).send("Unable to save to database");
		});

	return AQuestion;
};
