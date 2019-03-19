// Boom module to handle HTTP error responses
const boom = require('boom')
const express = require('express');

// The data model for questions
const question = require('../models/question')

// Requests a certain question with the id
exports.getQuestion = async (req, res) => {
  try {
    const id = req.params.id
    const Question = await question.findById(id)
	res.send(Question)
    return Question
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Requests all questions available
exports.getQuestions = async (req, res) => {
  try {
    const Questions = await question.find()
	res.send(Questions)
    return Questions
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Add a new question
exports.addQuestion = async (req, res) => {

  var AQuestion = await question.create(req.body)  
		 .then(item => {
		 res.send("New question added.");
		 })
		 .catch(err => {
		 res.status(400).send("Unable to save to database");
		 });
  return AQuestion

}