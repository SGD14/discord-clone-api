const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./src/routes/auth");
const friendsRouter = require("./src/routes/friends");
const requireAuth = require("./src/middlewares/requireAuth");

// Init Mongoose
mongoose.connect(process.env.DATABASE_URI);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/friends", friendsRouter);

app.get("/authtest", requireAuth, (req, res) => {
  res.json({message: "SUCCESS"});
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening at port ${port}`));
