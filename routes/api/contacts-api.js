const express = require("express");
const router = express.Router();
const controller = require("../../controllers/contacts-ctrl");
const { schemaContact } = require("../../controllers/schemas/validation");
const { validateRqBody } = require("../../decorators");

router.get("/", controller.getAllConstacs);
router.get("/:contactId", controller.getContactById);
router.post("/", validateRqBody(schemaContact), controller.addContact);
router.delete("/:contactId", controller.removeContact);
router.put("/:contactId", validateRqBody(schemaContact), controller.updateContact);
router.put("/:contactId/favorite", validateRqBody(schemaContact), controller.updateContact);

module.exports = router;
