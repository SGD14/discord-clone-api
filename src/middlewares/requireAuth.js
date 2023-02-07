const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader)
    return res.status(401).json({ error: "AUTHORIZATION_TOKEN_NOT_FOUND" });

  const token = authorizationHeader.replace(/Bearer /, "");

  try {
    req.user = jwt.verify(token, process.env.SECRET_KEY);
    return next();
  } catch (err) {
    return res.status(401).json("INVALID_TOKEN");
  }
};
