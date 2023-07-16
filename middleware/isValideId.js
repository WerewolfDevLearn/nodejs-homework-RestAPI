const { isValidObjectId } = require("mongoose");
const { httpErrHandler } = require("../helpers");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(httpErrHandler(404, `${contactId} inavalid id format`));
  }
  next();
};

module.exports = isValidId;
