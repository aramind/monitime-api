const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const quoteController = require("../controllers/quote");

// console.log("from quote router");
router.get("", auth, quoteController.getRandomQuote);

module.exports = router;
