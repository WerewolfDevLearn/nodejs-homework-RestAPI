const express = require("express");
const router = express.Router();
const controller = require("../../controllers/contacts-ctrl");
const { schemaContactJoi, schemaFavorite } = require("../../schemas/validation");
const { validateRqBody } = require("../../decorators");
const { isValidId } = require("../../middleware");

router.get("/", controller.getAllConstacs);
router.get("/:contactId", isValidId, controller.getContactById);
router.post("/", validateRqBody(schemaContactJoi), controller.addContact);
router.put("/:contactId", isValidId, validateRqBody(schemaContactJoi), controller.updateContact);
router.delete("/:contactId", isValidId, controller.removeContact);
router.patch("/:contactId/favorite", isValidId, validateRqBody(schemaFavorite), controller.updateContact);

module.exports = router;
