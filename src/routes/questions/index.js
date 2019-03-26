const express = require("express");
const router = express.Router();

// Controllers for different routes:
const QController = require("../../controllers/questions/QController");

//Routes for questions -collection:
router.get("/:id", QController.getQuestion);
router.get("/", QController.getQuestions);
router.post("/", QController.addQuestion);

// Export routes when required by server application
module.exports = router;
