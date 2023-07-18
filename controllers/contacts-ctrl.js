const Contact = require("../models/contacts-shm");
const { controlWrapper } = require("../decorators");
const { httpErrHandler } = require("../helpers");

const getAllConstacs = async (req, res) => {
  const { _id } = req.user;

  const { page = 1, limit = 20, favorite = false } = req.query;

  const skip = (page - 1) * limit;
  const allContacts = await Contact.find({ owner: _id }, "-createdAt -updatedAt", {
    skip,
    limit: Number(limit),
  }).populate("owner", "_id email ssubscription");
  if (favorite) {
    const result = allContacts.filter(contact => (contact.favorite = true));
    res.json(result);
  }

  res.json(allContacts);
};
const getContactById = async (req, res) => {
  const { _id } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findOne({ _id: contactId, owner: _id }).populate("owner", "_id email ssubscription");
  if (!result) {
    throw httpErrHandler(404);
  }
  res.json(result);
};
const addContact = async (req, res) => {
  const { _id } = req.user;
  const result = await Contact.create({ ...req.body, owner: _id });
  res.status(201).json(result);
};
const updateContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate({ _id: contactId, owner }, req.body, { new: true });
  if (!result) {
    throw httpErrHandler(404, `Contact with id ${contactId} not found`);
  }
  res.json(result);
};
const removeContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;

  const result = await Contact.findByIdAndRemove({ _id: contactId, owner });
  if (!result) {
    throw httpErrHandler(404);
  }
  res.json({
    message: `Contact with id ${contactId} deleted`,
  });
};

const updateContactStatus = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate({ _id: contactId, owner }, req.body, { new: true });
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
