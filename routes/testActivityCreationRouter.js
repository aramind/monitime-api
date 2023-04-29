const express = require("express");
const router = express.Router();
const testActivityCreationController = require("../controllers/testActivityCreation");
const auth = require("../middleware/auth");

router.post("/", auth, testActivityCreationController.createActivity);

module.exports = router;
