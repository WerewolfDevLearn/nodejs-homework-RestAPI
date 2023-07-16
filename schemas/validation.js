const Joi = require("joi");

const schemaContactJoi = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().min(7).max(14).required(),
  favorite: Joi.boolean().required(),
});

const schemaFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  schemaContactJoi,
  schemaFavorite,
};
