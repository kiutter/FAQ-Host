// Boom module to handle HTTP error responses
const boom = require('boom')

// The data model for questions
const question = require('../models/question')

// Requests a certain question with the id
exports.getQuestion = async (req, reply) => {
  try {
    const id = req.params.id
    const question = await question.findById(id)
    return question
  } catch (err) {
    throw boom.boomify(err)
  }
}

// Requests all questions available
exports.getQuestions = async (req, reply) => {
  try {
    const questions = await question.find()
    return questions
  } catch (err) {
    throw boom.boomify(err)
  }
}