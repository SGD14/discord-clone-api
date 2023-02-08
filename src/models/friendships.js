const mongoose = require("mongoose");

const Friendship = mongoose.model("Friendship", {
  user1: { type: mongoose.Schema.Types.ObjectId, index: true, required: true, ref: "User" },
  user2: { type: mongoose.Schema.Types.ObjectId, index: true, required: true, ref: "User" },
});

module.exports = Friendship;