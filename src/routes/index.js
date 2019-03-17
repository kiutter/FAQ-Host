// Controllers from controller-folder
const QController = require('../controllers/QController')

var express = require('express')
var router = express.Router();

//Define routes
//Route for one question, id as a parameter in URI:
router.route('/api/questions/:id').get(QController.getQuestion);
//Route for all questions, collection:
router.route('/api/questions').get(QController.getQuestions);

// Export routes when required by server application
module.exports = router;
