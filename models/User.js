const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photoURL: { type: String, default: "" },
  time_created: { type: Date, required: true },
  last_modified: { type: Date, required: true },
  settings: { type: Array },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", userSchema);
