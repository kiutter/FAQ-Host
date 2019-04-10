const express = require("express");
const router = express.Router();

// Controllers for different routes:
const QController = require("../../controllers/questions/QController");
const AController = require("../../controllers/answers/AController");

//Routes for questions -collection:
router.get("/:id", QController.getQuestion);
router.post("/:id/answers", AController.addAnswer);
router.get("/:id/answers", AController.getAnswers);
router.delete("/:id/answers/:answer_id", AController.delAnswer);
router.get("/", QController.getQuestions);
router.post("/", QController.addQuestion);

// Export routes when required by server application
module.exports = router;
