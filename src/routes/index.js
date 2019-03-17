// Controllers from controller-folder
const QController = require('../controllers/QController')

var express = require('express')
var router = express.Router();

//Define routes
router.route('/api/questions/:id').get(QController.getQuestion);
router.route('/api/questions').get(QController.getQuestions);

// Export routes
module.exports = router;
