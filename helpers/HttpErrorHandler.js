const errorStatus = require("./errorStatus");
function httpErrHandler(status, message = errorStatus[status]) {
  const error = new Error(message);
  error.status = status;
  return error;
}
module.exports = httpErrHandler;
