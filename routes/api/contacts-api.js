const express = require("express");
const router = express.Router();
const controller = require("../../controllers/contacts-ctrl");
const { schemaContactJoi, schemaFavorite } = require("../../schemas/validation");
const { validateRqBody } = require("../../decorators");
const { isValidId } = require("../../middleware");
const auth = require("../../middleware/auth-mw");

router.get("/", auth, controller.getAllConstacs);
router.get("/:contactId", auth, isValidId, controller.getContactById);
router.post("/", auth, validateRqBody(schemaContactJoi), controller.addContact);
router.put("/:contactId", auth, isValidId, validateRqBody(schemaContactJoi), controller.updateContact);
router.delete("/:contactId", auth, isValidId, controller.removeContact);
router.patch("/:contactId/favorite", auth, isValidId, validateRqBody(schemaFavorite), controller.updateContact);

module.exports = router;
