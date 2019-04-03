const express = require("express");
const router = express.Router();

// Controllers for different routes:
const AController = require("../../controllers/answers/AController");

//Routes for questions -collection:
//router.get("/:id", AController.getAnswer);
router.get("/", AController.getAllAnswers);

// Export routes when required by server application
module.exports = router;
