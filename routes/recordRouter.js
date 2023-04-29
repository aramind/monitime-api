const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const recordController = require("../controllers/record");

// console.log("from recordRouter");
router.post("/:label", auth, recordController.saveRecord);
router.get("/:label", auth, recordController.getRecord);
router.put("/:label", auth, recordController.resetRecord);
router.delete("/:label", auth, recordController.deleteRecord);

module.exports = router;
