const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const Friendship = require("../models/friendships");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get("/:userId", requireAuth, async (req, res) => {
  const user = await User.findById(req.params.userId, { password: 0 });

  // TODO - Check if user has permission to see the requested user info

  if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });

  return res.json(user);
});

userRouter.get("/:userId/friends", requireAuth, async (req, res) => {
  if (req.params.userId !== req.user._id)
    return res.status(400).json({ error: "UNAUTHORIZED" });

  const friendships = await Friendship.find({
    $or: [{ user1: req.params.userId }, { user2: req.params.userId }],
  });

  if (friendships.length === 0) return res.json([]);

  const friendIds = friendships.map((friendship) =>
    friendship.user1 === req.params.userId ? friendship.user2 : friendship.user1
  );

  const friends = await User.find(
    { _id: { $in: friendIds } },
    { email: 1, profilePicture: 1 }
  );

  return res.json(friends);
});

module.exports = userRouter;
