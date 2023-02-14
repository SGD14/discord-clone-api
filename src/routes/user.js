const express = require("express");
const { body, param } = require("express-validator");
const validationErrorHandler = require("../middlewares/validationErrorHandler");
const requireAuth = require("../middlewares/requireAuth");
const Friendship = require("../models/friendships");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get(
  "/:userId",
  requireAuth,
  param("userId").isMongoId().withMessage("INVALID_USER_ID"),
  validationErrorHandler,
  async (req, res) => {
    const user = await User.findOne(
      { _id: req.params.userId },
      {
        email: 1,
        profilePicture: 1,
      }
    );

    // TODO - Check if user has permission to see the requested user info

    if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });

    return res.json(user);
  }
);

userRouter.get(
  "/:userId/friends",
  requireAuth,
  param("userId").isMongoId().withMessage("INVALID_USER_ID"),
  validationErrorHandler,
  async (req, res) => {
    if (req.params.userId !== req.user._id)
      return res.status(400).json({ error: "UNAUTHORIZED" });

    const friendships = await Friendship.find({
      $or: [{ user1: req.params.userId }, { user2: req.params.userId }],
    });

    if (friendships.length === 0) return res.json([]);

    const friendIds = friendships.map((friendship) =>
      friendship.user1.toString() === req.params.userId
        ? friendship.user2
        : friendship.user1
    );

    const friends = await User.find(
      { _id: { $in: friendIds } },
      { email: 1, profilePicture: 1 }
    );

    return res.json(friends);
  }
);

userRouter.get(
  "/:userId/friend-chat-shortcuts",
  requireAuth,
  param("userId").isMongoId().withMessage("INVALID_USER_ID"),
  validationErrorHandler,
  async (req, res) => {
    if (req.params.userId !== req.user._id)
      return res.status(400).json({ error: "UNAUTHORIZED" });

    const user = await User.findById(req.params.userId, {
      _id: 0,
      friendChatShortcuts: 1,
    });

    return res.json(user.friendChatShortcuts);
  }
);

userRouter.post(
  "/:userId/friend-chat-shortcuts",
  requireAuth,
  param("userId").isMongoId().withMessage("INVALID_USER_ID"),
  body("friendId").notEmpty().withMessage("INVALID_FRIEND_ID").escape(),
  validationErrorHandler,
  async (req, res) => {
    if (req.params.userId !== req.user._id)
      return res.status(400).json({ error: "UNAUTHORIZED" });

    await User.updateOne(
      { _id: req.params.userId },
      {
        $addToSet: { friendChatShortcuts: req.body.friendId },
      }
    );

    return res.json(null);
  }
);

module.exports = userRouter;
