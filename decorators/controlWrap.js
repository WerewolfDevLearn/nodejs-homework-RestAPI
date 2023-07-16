const controlWrapper = contoller => {
  return async (req, res, next) => {
    try {
      await contoller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
module.exports = controlWrapper;
