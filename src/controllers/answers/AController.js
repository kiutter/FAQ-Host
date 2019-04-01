// The data models
const models = require("../../models/models.js");
const halson = require("halson");
// Add a new answer
exports.addAnswer = async (req, res) => {
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
				console.log(err);
			});
		});
	})
		.then(item => {
			res.send("New answer added.");
		})
		.catch(err => {
			console.log(err);
		});

	return;
};

// Get answers for a question
exports.getAnswer = async (req, res) => {
	try {
		await models.Question.findOne({ _id: req.params.id })
			.populate("answers")
			.exec((err, Q) => {
				if (err) throw new Error(err);
				var Qanswers = halson()
					.addLink("self", "/questions/" + req.params.id + "/answers")
					.addEmbed("answers", JSON.stringify(Q.answers));
				console.log(Q.answers);
				res.status(200).json(Qanswers);
			});
	} catch (error) {
		console.log(error);
	}
};
