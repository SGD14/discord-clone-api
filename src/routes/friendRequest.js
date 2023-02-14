const express = require("express");
const { body, param } = require("express-validator");
const mongoose = require("mongoose");
const validationErrorHandler = require("../middlewares/validationErrorHandler");
const requireAuth = require("../middlewares/requireAuth");
const FriendRequest = require("../models/friendRequest");
const Friendship = require("../models/friendships");
const User = require("../models/user");

const friendRequestRouter = express.Router();

friendRequestRouter.get("/", requireAuth, async (req, res) => {
  const requests = await FriendRequest.find({ receiver: req.user._id });
  return res.json(requests);
});

friendRequestRouter.post(
  "/",
  requireAuth,
  body("email").notEmpty().isEmail().withMessage("INVALID_EMAIL"),
  validationErrorHandler,
  async (req, res) => {
    // Check the receiver user exists
    const receiverId = (await User.findOne({ email: req.body.email }))?._id;
    if (!receiverId) return res.status(400).json({ error: "USER_NOT_FOUND" });

    // Check user is not trying to friend himself
    if (receiverId.toString() === req.user._id)
      return res.status(400).json({ error: "CANT_FRIEND_SELF" });

    // Check that users are not friend already
    const friendship = await Friendship.findOne({
      $or: [
        { user1: req.user._id, user2: receiverId },
        { user1: receiverId, user2: req.user._id },
      ],
    });

    if (friendship) return res.status(400).json({ error: "ALREADY_FRIEND" });

    // Check the request does not exist already.
    const existingRequest = await FriendRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
    });

    if (existingRequest)
      return res.status(400).json({ error: "REQUEST_ALREADY_MADE" });

    // Create the request
    await FriendRequest({
      sender: req.user._id,
      receiver: receiverId,
    }).save();

    return res.json({ MESSAGE: "REQUEST_CREATED" });
  }
);

friendRequestRouter.delete(
  "/:requestId/accept",
  requireAuth,
  param("requestId").isMongoId().withMessage("INVALID_USER_ID"),
  validationErrorHandler,
  async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const request = await FriendRequest.findOneAndDelete({
        _id: req.params.requestId,
        receiver: req.user._id,
      }).session(session);

      if (!request) {
        await session.abortTransaction();
        return res.status(400).json({ error: "REQUEST_NOT_FOUND" });
      }

      await Friendship({
        user1: request.sender,
        user2: request.receiver,
      }).save({ session });

      await session.commitTransaction();

      return res.status(200).json(null);
    } catch (error) {
      await session.abortTransaction();
      return next(error);
    } finally {
      await session.endSession();
    }
  }
);

friendRequestRouter.delete(
  "/:requestId/decline",
  requireAuth,
  param("requestId").isMongoId().withMessage("INVALID_USER_ID"),
  validationErrorHandler,
  async (req, res) => {
    const request = await FriendRequest.findOneAndDelete({
      _id: req.params.requestId,
      receiver: req.user._id,
    });

    if (!request) return res.status(400).json({ error: "REQUEST_NOT_FOUND" });

    return res.status(200).json(null);
  }
);

module.exports = friendRequestRouter;
