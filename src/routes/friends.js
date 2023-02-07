const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");

const friendsRouter = express.Router();

friendsRouter.post("/addfriend", requireAuth, async (req, res) => {
  try {
    // Check the receiver user exists
    const receiverId = (await User.findOne({ email: req.body.email }))?._id;
    if (!receiverId) return res.status(400).json({ error: "USER_NOT_FOUND" });

    // Check user is not trying to friend himself
    if (receiverId.toString() === req.user._id)
      return res.status(400).json({ error: "CANT_FRIEND_SELF" });

    // TODO - Check that users are not friend already

    // Check the request does not exist already.
    const existingRequest = await FriendRequest.findOne({
      sender_id: req.user._id,
      receiver_id: receiverId,
    });

    if (existingRequest)
      return res.status(400).json({ error: "REQUEST_ALREADY_MADE" });

    // Create the request
    await FriendRequest({
      sender_id: req.user._id,
      receiver_id: receiverId,
    }).save();

    return res.json({ MESSAGE: "REQUEST_CREATED" });
  } catch (error) {
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
});

module.exports = friendsRouter;
