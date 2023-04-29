const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  category: { type: [String], required: true },
  content: { type: String, required: true, unique: true },
  author: { type: String, required: true },
});

module.exports = mongoose.model("Quote", quoteSchema);
