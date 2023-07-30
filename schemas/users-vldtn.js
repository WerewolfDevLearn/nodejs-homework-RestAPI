const Joi = require("joi");
const userRegisterJoi = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
  token: Joi.string(),
});

const userLoginJoi = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
});

const userSubscription = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
});
const userEmailSchem = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
});

module.exports = {
  userRegisterJoi,
  userLoginJoi,
  userSubscription,
  userEmailSchem,
};
