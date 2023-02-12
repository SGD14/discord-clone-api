const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const PrivateMessage = require("../models/privateMessage");

const privateMessageRouter = express.Router();

privateMessageRouter.get("/users/:userId", requireAuth, async (req, res) => {
  const messages = await PrivateMessage.find({
    $or: [
      { sender: req.params.userId, receiver: req.user._id },
      { sender: req.user._id, receiver: req.params.userId },
    ],
  }).sort({ createDate: 1 });

  return res.json(messages);
});

privateMessageRouter.post("/users/:userId", requireAuth, async (req, res) => {
  const newMessage = await PrivateMessage({
    sender: req.user._id,
    receiver: req.params.userId,
    text: req.body.text,
  }).save();

  return res.json(newMessage);
});

module.exports = privateMessageRouter;
