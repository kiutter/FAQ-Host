// Boom module to handle HTTP error responses
const boom = require("boom");
//Module for HAL responses:
const halson = require("halson");
// The data models
const models = require("../../models/models.js");

// Requests a certain question with the id
exports.getQuestion = async (req, res) => {
	try {
		const id = req.params.id; //get id from URI parameter
		const Question = await models.Question.findById(id); //find question by id
		res.setHeader("Content-Type", "application/hal+json");
		var resource = halson({ question: Question.question, author: Question.author, time: Question.time })
			.addLink("self", "/questions/" + Question._id) //Add self relation
			.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#reference/relations/{rel}" }]) //Add curies for relation docs
			.addLink("aa:answers-for", "/questions/" + Question._id + "/answers"); //link to get all answers
		res.send(JSON.stringify(resource));
		return Question;
	} catch (err) {
		err = boom.notFound("Question id not found!");
		res.status(err.output.statusCode).json(err.output.payload);
	}
};

// Requests all questions available
exports.getQuestions = async (req, res) => {
	try {
		const Questions = await models.Question.find();
		res.setHeader("Content-Type", "application/hal+json");

		var results = [];
		for (var i = 0; i < Questions.length; i++) {
			var resource = halson({ question: Questions[i].question }) //, author: Questions[i].author, time: Questions[i].time })
				.addLink("self", "/questions/" + Questions[i]._id);
			//		.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#reference/relations/{rel}" }]) //Add curies for relation docs
			//		.addLink("aa:answers-for", "/questions/" + Questions[i]._id + "/answers"); //link to get all answers
			results.push(resource);
		}
		var resource_all = halson()
			.addLink("self", "/questions")
			.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#reference/relations/{rel}" }]) //Add curies for relation docs
			.addLink("aa:add-question", { href: "/questions", type: "application/hal+json" }) //from "add-user" and type, user should know its a post
			.addEmbed("questions", results);
		res.send(JSON.stringify(resource_all));
		return Questions;
	} catch (err) {
		throw boom.boomify(err);
	}
};

// Add a new question
exports.addQuestion = async (req, res) => {
	try {
		if (req.is("*/json")) {
			//make sure that the media type is JSON.

			const { question, author } = req.body;
			if (question && author) {
				//make sure that the request has question and author for it
				var AQuestion = await models.Question.create({ question, author }, (err, question) => {
					if (err) {
						console.log(err);
						throw new Error(err);
					}

					var resource = halson({ question: question.question }) //, author: question.author, time: question.time }) // If the POST was successfull, send the added question as response in HAL+JSON.
						.addLink("self", "/questions/" + question._id); //Add self relation
					//	.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#reference/relations/{rel}" }]) //Add curies for relation docs
					//	.addLink("aa:answers-for", "/questions/" + question._id + "/answers"); //link to get all answers
					res.status(201).send(resource);
				});
			} else {
				err = boom.notAcceptable("Invalid data! Please use format: {'question': 'question here', 'author': 'name here'}"); // didn't have all parameters
				res.status(err.output.statusCode).json(err.output.payload);
			}
		} else {
			err = boom.unsupportedMediaType("Media type not supported! Please use application/JSON"); //wrong media type error
			res.status(err.output.statusCode).json(err.output.payload);
		}

		return;
	} catch (error) {
		err = boom.notAcceptable("Invalid data! Please use format: {'question': 'question here', 'author': 'name here'}"); // didn't have all parameters
		res.status(err.output.statusCode).json(err.output.payload);
	}
};
