const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./src/routes/auth");
const friendRequestRouter = require("./src/routes/friendRequest");
const userRouter = require("./src/routes/user");

// Init Mongoose
mongoose.connect(process.env.DATABASE_URI);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/friend-requests", friendRequestRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening at port ${port}`));
