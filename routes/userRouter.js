const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.patch("/update-profile", auth, userController.updateProfile);
// SOFT DELETION
router.delete("/deactivate", auth, userController.deactivateUser);
router.patch("/reactivate", auth, userController.reactivateUser);

module.exports = router;
