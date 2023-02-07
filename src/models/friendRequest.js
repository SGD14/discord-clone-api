const mongoose = require("mongoose");

const FriendRequest = mongoose.model("Friend_Request", {
  sender_id: { type: mongoose.Schema.Types.ObjectId, index: true, required: true, ref: "User" },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, index: true, required: true, ref: "User" },
});

module.exports = FriendRequest;
