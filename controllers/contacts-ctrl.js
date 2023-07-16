const Contact = require("../models/contacts-shm");
const { controlWrapper } = require("../decorators");
const httpErrHandler = require("../helpers");

const getAllConstacs = async (_, res) => {
  const result = await Contact.find();
  res.json(result);
};
const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findOne({ _id: contactId });
  if (!result) {
    throw httpErrHandler(404);
  }
  res.json(result);
};
const addContact = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};
const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!result) {
    throw httpErrHandler(404, `Contact with id ${contactId} not found`);
  }
  res.json(result);
};
const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw httpErrHandler(404);
  }
  res.json({
    message: `Contact with id ${contactId} deleted`,
  });
};

const updateContactStatus = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!result) {
    throw httpErrHandler(404, `Contact with ${contactId} not found`);
  }
  res.json(result);
};

module.exports = {
  getAllConstacs: controlWrapper(getAllConstacs),
  getContactById: controlWrapper(getContactById),
  addContact: controlWrapper(addContact),
  updateContact: controlWrapper(updateContact),
  removeContact: controlWrapper(removeContact),
  updateContactStatus: controlWrapper(updateContactStatus),
};
