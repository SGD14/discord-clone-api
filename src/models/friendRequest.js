const mongoose = require("mongoose");

const FriendRequest = mongoose.model("Friend_Request", {
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    ref: "User",
  },
});

module.exports = FriendRequest;
