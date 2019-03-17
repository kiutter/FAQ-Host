// Controllers from controller-folder
const QController = require('../controllers/QController')

const routes = [
  {
    method: 'GET',
    url: '/api/questions/:id',
    handler: QController.getQuestion
  },
  {
    method: 'GET',
    url: '/api/questions',
    handler: QController.getQuestions
  }
  ]

// Export routes when required by server application
module.exports = routes;
