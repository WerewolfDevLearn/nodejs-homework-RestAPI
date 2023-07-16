const express = require("express");
const contactMTD = require("../models/contacts");
const router = express.Router();
const validate = require("../routes/api/validation");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactMTD.listContacts();
    return res.json({ message: "success", status: "success", code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await contactMTD.getContactById(req.params.contactId);
    if (contact) {
      res.json({
        status: "success",
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        message: "Contact not found",
        status: "error",
        code: 404,
        data: "Contact not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", validate, async (req, res, next) => {
  try {
    const contact = await contactMTD.addContact(req.body);
    return res.json({ message: "success", status: "success", code: 200, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await contactMTD.removeContact(req.params.contactId);
    console.log("contact: ", contact);
    if (contact) {
      return res.json({
        message: "contact deleted",
        status: "success",
        code: 200,
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: "Not Found",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", validate, async (req, res, next) => {
  try {
    const contact = await contactMTD.updateContact(req.params.contactId, req.body);
    // console.log("contact: ", contact);
    if (contact) {
      return res.json({
        status: "success",
        message: "contact updated",
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: 404,
        data: "Not Found",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
