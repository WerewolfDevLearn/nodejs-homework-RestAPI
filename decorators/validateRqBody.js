const { httpErrHandler } = require("../helpers");

const validateRqBody = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const [{ message }] = error.details;
      next(httpErrHandler(400, `Filed: ${message.replace(/"/g, "")}`));
    }
    next();
  };
};
module.exports = validateRqBody;
