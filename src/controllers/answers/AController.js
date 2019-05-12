// Boom module to handle HTTP error responses
const boom = require("boom");
// The data models
const models = require("../../models/models.js");
//Module for HAL responses:
const halson = require("halson");
//Add mongoose to validate objectids
const mongoose = require("mongoose");
// Add a new answer
exports.addAnswer = async (req, res) => {
	try {
		if (mongoose.Types.ObjectId.isValid(req.params.id)) {
			if (req.is("*/json")) {
				models.Question.findById(req.params.id, (err, que) => {
					if (err) {
						console.log("");
					}

					// New answer:
					if (que) {
						if (req.body.answer && req.body.author) {
							const newAnswer = {
								answer: req.body.answer,
								author: req.body.author,
								//Question id is stored also for answer.
								question: que._id
							};

							// Create the new answer to db.
							models.Answer.create(newAnswer, (err, answer) => {
								if (err) {
									err = boom.notAcceptable("Answer already exists!"); // Answer already exists
									res.status(err.output.statusCode).json(err.output.payload);
								} else {
									//Adds the answer id to the questions answers-array
									que.answers.push(answer._id);
									// save
									que.save(function(err) {
										if (err) return console.log(err);
										// saved!
									});

									var answers = halson({ answer: answer.answer }) //, author: answer.author, time: answer.time })
										.addLink("self", "/questions/" + req.params.id + "/answers/" + answer._id); // self-link
									//	.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#introduction/relations/{rel}" }]) //Add curies for relation docs
									//	.addLink("aa:answers-for", "/questions/" + req.params.id + "/answers/") //link to answers for one question
									//	.addLink("aa:add-answer", { href: "/questions/" + req.params.id + "/answers/", type: "application/hal+json" }); //from "add-user" and type, user should know its a post
									answers._templates = {};
									res.setHeader("Content-Type", "application/prs.hal-forms+json");
									res.status(201).json(answers);
									return answer;
									//res.send(answer);
								}
							});
						} else {
							err = boom.notAcceptable("Invalid data! Please use format: {'answer': 'answer here', 'author': 'name here'}"); // didn't have all parameters
							res.status(err.output.statusCode).json(err.output.payload);
						}
					} else {
						err = boom.notFound("Question id not found!");
						res.status(err.output.statusCode).json(err.output.payload);
					}
				});

				return;
			} else {
				err = boom.unsupportedMediaType("Media type not supported! Please use application/JSON"); //wrong media type error
				res.status(err.output.statusCode).json(err.output.payload);
			}
		} else {
			//same "not found" -response, even if the id is not valid
			err = boom.notFound("Question id not found!");
			res.status(err.output.statusCode).json(err.output.payload);
		}
	} catch (err) {
		err = boom.notFound("Question id not found!");
		res.status(err.output.statusCode).json(err.output.payload);
	}
};

// Get answers for a certain question
exports.getAnswers = async (req, res) => {
	try {
		if (mongoose.Types.ObjectId.isValid(req.params.id)) {
			await models.Question.findOne({ _id: req.params.id })
				//finds the question by id
				.populate("answers", "answer") //populates the answers array with data from Answers-collection.
				.exec((err, Q) => {
					if (Q) {
						if (err) {
							throw new Error(err);
						}
						var Qanswers = halson()
							.addLink("self", "/questions/" + req.params.id + "/answers") // self-link
							.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#introduction/relations/{rel}" }]) //Add curies for relation docs
							.addLink("aa:add-answer", { href: "/questions/" + req.params.id + "/answers", type: "application/hal+json" }) //from "add-answer" and type, user should know its a post
							.addEmbed("answers", JSON.stringify(Q.answers)); // all the answers as embedded link
						Qanswers._templates = {
							default: {
								title: "add-answer",
								method: "post",
								contentType: "application/json",
								properties: [
									{
										name: "answer",
										required: true
									},
									{
										name: "author",
										required: false
									}
								]
							}
						};
						//console.log(Q.answers);
						res.setHeader("Content-Type", "application/prs.hal-forms+json");
						res.status(200).json(Qanswers);
					} else {
						err = boom.notFound("Question id not found!");
						res.status(err.output.statusCode).json(err.output.payload);
					}
				});
		} else {
			//same "not found" -response, even if the id is not valid
			err = boom.notFound("Question id not found!");
			res.status(err.output.statusCode).json(err.output.payload);
		}
	} catch (err) {
		err = boom.notFound("Question id not found!");
		res.status(err.output.statusCode).json(err.output.payload);
	}
};

// Delete answer for a certain question
exports.delAnswer = async (req, res) => {
	try {
		if (mongoose.Types.ObjectId.isValid(req.params.id) && mongoose.Types.ObjectId.isValid(req.params.answer_id)) {
			models.Question.findById(req.params.id) //lets first see if the question even exists
				.orFail()
				.exec((err, question) => {
					if (err) {
						err = boom.notFound("Question id not found!");
						res.status(err.output.statusCode).json(err.output.payload);
					} else {
						models.Question.findById(req.params.id, function(err, question) {
							//console.log(question.answers[0]);
							//console.log(req.params.answer_id);
							var isInArray = question.answers.some(function(answer) {
								if (err) {
								}
								return answer.equals(req.params.answer_id);
							});

							if (isInArray) {
								models.Answer.findById({ _id: req.params.answer_id }) //finds the answer by id
									.deleteOne()
									.orFail()
									.exec(function(err, A) {
										if (err) {
											err = boom.notFound("Answer id not found!");
											res.status(err.output.statusCode).json(err.output.payload);
										}
										if (A) {
											//Delete also reference in question
											models.Question.findById(req.params.id, function(err, question) {
												if (err) {
													return console.log(err);
												}
												question.answers.pull(req.params.answer_id);
												question.updateOne();
											});
											//Response as HAL
											//var OneAnswer = halson().addLink("self", "/questions/" + req.params.id + "/answers/" + req.params.answer_id); // self-link
											//	.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#introduction/relations/{rel}" }]) //Add curies for relation docs
											//	.addLink("aa:answers-for", "/questions/" + req.params.id + "/answers"); //link to get all answers for certain question
											var response = "/questions/" + req.params.id + "/answers/" + req.params.answer_id + " DELETED!";
											res.setHeader("Content-Type", "application/json");
											res.status(200).json(response);
										}
									});
							} else {
								err = boom.notFound("This is not answer for this question!");
								res.status(err.output.statusCode).json(err.output.payload);
							}
						});
					}
				});
		} else {
			//same "not found" -response, even if the id is not valid
			if (mongoose.Types.ObjectId.isValid(req.params.id)) {
				err = boom.notFound("Answer id not found!");
				res.status(err.output.statusCode).json(err.output.payload);
			} else {
				err = boom.notFound("Question id not found!");
				res.status(err.output.statusCode).json(err.output.payload);
			}
		}
	} catch (err) {
		err = boom.notFound("Answer id not found!");
		res.status(err.output.statusCode).json(err.output.payload);
	}
};

// Get a specific answer
exports.getAnswer = async (req, res) => {
	try {
		if (mongoose.Types.ObjectId.isValid(req.params.id) && mongoose.Types.ObjectId.isValid(req.params.answer_id)) {
			models.Question.findById(req.params.id) //lets first see if the question even exists
				.orFail()
				.exec((err, question) => {
					if (err) {
						err = boom.notFound("Question id not found!");
						res.status(err.output.statusCode).json(err.output.payload);
					} else {
						models.Question.findById(req.params.id, function(err, question) {
							//console.log(question.answers[0]);
							//console.log(req.params.answer_id);
							var isInArray = question.answers.some(function(answer) {
								if (err) {
								}
								return answer.equals(req.params.answer_id);
							});

							if (isInArray) {
								models.Answer.findById({ _id: req.params.answer_id }) //finds the answer by id
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
												.addLink("self", "/questions/" + req.params.id + "/answers" + req.params.answer_id) // self-link
												.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#introduction/relations/{rel}" }]) //Add curies for relation docs
												.addLink("aa:answers-for", "/questions/" + req.params.id + "/answers"); //link to get all answers for certain question
											OneAnswer._templates = {
												default: {
													title: "Edit the answer",
													method: "put",
													contentType: "application/json",
													properties: [
														{
															name: "question",
															required: true
														},
														{
															name: "author",
															required: false
														}
													]
												},
												delete: {
													title: "Delete the answer",
													method: "delete",
													contentType: "",
													properties: []
												}
											};
											res.setHeader("Content-Type", "application/prs.hal-forms+json");
											res.status(200).json(OneAnswer);
										} else {
											err = boom.notFound("Answer id not found!");
											res.status(err.output.statusCode).json(err.output.payload);
										}
									});
							} else {
								err = boom.notFound("This is not answer for this question!");
								res.status(err.output.statusCode).json(err.output.payload);
							}
						});
					}
				});
		} else {
			//same "not found" -response, even if the id is not valid
			if (mongoose.Types.ObjectId.isValid(req.params.id)) {
				err = boom.notFound("Answer id not found!");
				res.status(err.output.statusCode).json(err.output.payload);
			} else {
				err = boom.notFound("Question id not found!");
				res.status(err.output.statusCode).json(err.output.payload);
			}
		}
	} catch (err) {
		err = boom.notFound("Answer id not found!");
		res.status(err.output.statusCode).json(err.output.payload);
	}
};

// Update a specific answer
exports.editAnswer = async (req, res) => {
	try {
		if (req.is("*/json")) {
			if (mongoose.Types.ObjectId.isValid(req.params.id) && mongoose.Types.ObjectId.isValid(req.params.answer_id)) {
				if ((req.body.answer && req.body.author) || req.body.answer) {
					var question = models.Question.findById(req.params.id)
						.orFail()
						.exec((err, A) => {
							if (err) {
								err = boom.notFound("Question id not found!");
								res.status(err.output.statusCode).json(err.output.payload);
							} else {
								var isInArray = A.answers.some(function(answer) {
									if (err) {
									}
									return answer.equals(req.params.answer_id);
								});

								if (isInArray) {
									models.Answer.findByIdAndUpdate({ _id: req.params.answer_id }, req.body, { new: true }) //finds the answer by id and update it
										.orFail()
										.exec((err, A) => {
											if (err) {
												err = boom.notFound("This is not answer for this question!");
												res.status(err.output.statusCode).json(err.output.payload);
											} else {
												var OneAnswer = halson({
													_id: A._id,
													answer: A.answer,
													author: A.author,
													time: A.time
												}).addLink("self", "/questions/" + req.params.id + "/answers" + req.params.answer_id); // self-link
												//	.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#introduction/relations/{rel}" }]) //Add curies for relation docs
												//	.addLink("aa:answers-for", "/questions/" + req.params.id + "/answers"); //link to get all answers for certain question
												OneAnswer._templates = {};
												res.setHeader("Content-Type", "application/prs.hal-forms+json");
												res.status(200).json(OneAnswer);
											}
										});
								} else {
									err = boom.notFound("This is not answer for this question!");
									res.status(err.output.statusCode).json(err.output.payload);
								}
							}
						});
				} else {
					err = boom.notAcceptable("Invalid data! Please use format: {'answer': 'answer here'} or {'answer': 'answer here', 'author': 'name here'}"); // didn't have correct parameters
					res.status(err.output.statusCode).json(err.output.payload);
				}
			} else {
				//same "not found" -response, even if the id is not valid
				if (mongoose.Types.ObjectId.isValid(req.params.id)) {
					err = boom.notFound("Answer id not found!");
					res.status(err.output.statusCode).json(err.output.payload);
				} else {
					err = boom.notFound("Question id not found!");
					res.status(err.output.statusCode).json(err.output.payload);
				}
			}
		} else {
			err = boom.unsupportedMediaType("Media type not supported! Please use application/JSON"); //wrong media type error
			res.status(err.output.statusCode).json(err.output.payload);
		}
	} catch (err) {
		err = boom.notFound("Answer id not found!");
		res.status(err.output.statusCode).json(err.output.payload);
	}
};

// // Requests all answers available
// exports.getAllAnswers = async (req, res) => {
// 	try {
// 		await models.Answer.find()
// 			.populate("question", "question")
// 			.exec((err, Answers) => {
// 				if (err) {
// 					throw new Error(err);
// 				}
// 				res.setHeader("Content-Type", "application/hal+json");
// 				var results = [];
// 				if (Answers) {
// 					console.log(Answers);
// 					for (var i = 0; i < Answers.length; i++) {
// 						var resource = halson({ answer: Answers[i].answer, author: Answers[i].author, question: Answers[i].question, time: Answers[i].time })
// 							.addLink("self", "/answers/" + Answers[i]._id)
// 							.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#introduction/relations/{rel}" }]) //Add curies for relation docs
// 							.addLink("aa:answers-for", "/questions/" + Answers[i].question["_id"] + "/answers"); //link to get all answers
// 						results.push(resource);
// 					}
// 				}

// 				var resource_all = halson()
// 					.addLink("self", "/answers")
// 					.addLink("curies", [{ name: "aa", href: "https://faqhost.docs.apiary.io/#introduction/relations/{rel}" }]) //Add curies for relation docs
// 					.addLink("aa:answers-for", "/questions/{question id}/answers") //link to get all answers for one question
// 					.addLink("aa:questions-all", "/questions") //link to get all questions
// 					.addEmbed("answers", results);
// 				res.send(JSON.stringify(resource_all));
// 			});
// 	} catch (err) {
// 		throw boom.boomify(err);
// 	}
// };
