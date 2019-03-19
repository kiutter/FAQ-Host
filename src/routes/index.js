const express = require('express')
const router = express.Router()


// Controllers for different routes:
const QController = require('../controllers/QController')

//Routes for questions -collection:
router.get('/questions/:id', QController.getQuestion) 
router.get('/questions', QController.getQuestions);
router.post('/questions', QController.addQuestion);

// Export routes when required by server application
module.exports = router;
