const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  seconds_spent: { type: String, required: true },
});

const recordSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: function () {
      // extract date part of the label
      const dateStr = this.label.split("@")[0];
      // parse date string to Date object
      return new Date(dateStr);
    },
  },
  last_modified: { type: Date, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  activities: [activitySchema],
});

module.exports = mongoose.model("Record", recordSchema);
