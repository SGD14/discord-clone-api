const mongoose = require("mongoose");

const PrivateMessage = mongoose.model("Private_Message", {
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
  text: { type: String, required: true },
  createDate: {type: Date, default: () => new Date()}
});

module.exports = PrivateMessage;
