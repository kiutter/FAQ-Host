const express = require("express");
const router = express.Router();

// Controllers for different routes:
const AController = require("../controllers/answers/AController");
const QController = require("../controllers/questions/QController");

//Routes for qanswers -collection:
router.post("/:id/answers", AController.addAnswer);
router.get("/:id/answers", AController.getAnswers);
router.get("/:id/answers/:answer_id", AController.getAnswer);
router.delete("/:id/answers/:answer_id", AController.delAnswer);

//Routes for questions -collection:
router.get("/:id", QController.getQuestion);
router.get("/", QController.getQuestions);
router.post("/", QController.addQuestion);

// Export routes when required by server application
module.exports = router;
