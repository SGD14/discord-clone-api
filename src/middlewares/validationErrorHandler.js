const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      error: "INVALID_REQUEST",
      validationErrors: validationErrors.array().map((error) => error.msg),
    });
  }

  return next();
};
