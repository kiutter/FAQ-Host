// Boom module to handle HTTP error responses
const boom = require("boom");
// The data models
const models = require("../../models/models.js");
//Module for HAL responses:
const halson = require("halson");
// Add a new answer
exports.addAnswer = async (req, res) => {
	var new_answer;
	models.Question.findById(req.params.id, (err, que) => {
		if (err) throw new Error(err);
		// New answer:
		const newAnswer = {
			answer: req.body.answer,
			author: req.body.author,
			//Question id is stored also for answer.
			question: que._id
		};
		// Create the new answer to db.
		models.Answer.create(newAnswer, (err, answer) => {
			if (err) {
				console.log(err);
				throw new Error(err);
			}

			//Adds the answer id to the questions answers-array
			que.answers.push(answer._id);
			// save
			que.save(err => {
				console.log("save failed");
			});
			return answer;
			//res.send(answer);
		});
	})
		.then(answer => {
			res.send(answer.answers);
		})
		.catch(err => {
			console.log(err);
		});

	return;
};

// Get answers for a certain question
exports.getAnswers = async (req, res) => {
	try {
		await models.Question.findOne({ _id: req.params.id }) //finds the question by id
			.populate("answers") //populates the answers array with data from Answers-collection.
			.exec((err, Q) => {
				if (Q) {
					if (err) {
						throw new Error(err);
					}

					var Qanswers = halson()
						.addLink("self", "/questions/" + req.params.id + "/answers") // self-link
						.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#reference/relations/{rel}" }]) //Add curies for relation docs
						.addLink("aa:answers-all", "/answers") //link to get all answers
						.addLink("aa:add-answer", { href: "/questions/" + req.params.id + "/answers", type: "application/hal+json" }) //from "add-answer" and type, user should know its a post
						.addEmbed("answers", JSON.stringify(Q.answers)); // all the answers as embedded link
					console.log(Q.answers);
					res.status(200).json(Qanswers);
				} else {
					err = boom.notFound("Question id not found!");
					res.status(err.output.statusCode).json(err.output.payload);
				}
			});
	} catch (err) {
		err = boom.notFound("Question id not found!");
		res.status(err.output.statusCode).json(err.output.payload);
	}
};

// Get a specific answer
exports.getAnswer = async (req, res) => {
	try {
		await models.Answer.findById({ _id: req.params.id }) //finds the answer by id
			.exec((err, A) => {
				if (A) {
					if (err) {
						throw new Error(err);
					}

					var OneAnswer = halson({
						_id: A._id,
						answer: A.answer,
						author: A.author,
						time: A.time
					})
						.addLink("self", "/answers/" + req.params.id) // self-link
						.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#reference/relations/{rel}" }]) //Add curies for relation docs
						.addLink("aa:answers-for", "/questions/" + req.params.id + "/answers"); //link to get all answers for certain question
					res.status(200).json(OneAnswer);
				} else {
					err = boom.notFound("Answer id not found!");
					res.status(err.output.statusCode).json(err.output.payload);
				}
			});
	} catch (err) {
		err = boom.notFound("Answer id not found!");
		res.status(err.output.statusCode).json(err.output.payload);
	}
};

// Requests all answers available
exports.getAllAnswers = async (req, res) => {
	try {
		const Answers = await models.Answer.find()
			.populate("question", "question")
			.then(Answers => {
				res.setHeader("Content-Type", "application/hal+json");

				var results = [];
				for (var i = 0; i < Answers.length; i++) {
					var resource = halson({ answer: Answers[i].answer, author: Answers[i].author, question: Answers[i].question, time: Answers[i].time })
						.addLink("self", "/answers/" + Answers[i]._id)
						.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#reference/relations/{rel}" }]) //Add curies for relation docs
						.addLink("aa:answers-for", "/questions/" + Answers[i].question["_id"] + "/answers"); //link to get all answers
					results.push(resource);
				}
				var resource_all = halson()
					.addLink("self", "/answers")
					.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#reference/relations/{rel}" }]) //Add curies for relation docs
					.addLink("aa:answers-for", "/questions/{question id}/answers") //link to get all answers for one question
					.addLink("aa:questions-all", "/questions") //link to get all questions
					.addEmbed("answers", results);
				res.send(JSON.stringify(resource_all));
				return Answers;
			})
			.catch(err => {
				console.log(err);
			});
	} catch (err) {
		throw boom.boomify(err);
	}
};
