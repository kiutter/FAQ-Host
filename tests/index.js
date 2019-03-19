module.exports = function(app) {
  var questions = require('../routes/questions');
  app.use('/', questions);
};