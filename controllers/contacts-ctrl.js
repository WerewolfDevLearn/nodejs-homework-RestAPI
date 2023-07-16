const Contact = require("./schemas/contacts-shm");
const { controlWrapper } = require("../decorators");

const getAllConstacs = async () => {
  return Contact.find({});
};
const getContactById = contactId => {
  return Contact.findOne({ _id: contactId });
};
const addContact = async ({ name, email, phone }) => {
  return Contact.create({ name, email, phone });
};
const updateContact = async (contactId, fields) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, fields, { new: true });
};
const removeContact = async contactId => {
  return Contact.findByIdAndRemove({ _id: contactId });
};

const updateContactStatus = async (contactId, favorite) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, { favorite }, { new: true });
};

module.exports = {
  getAllConstacs: controlWrapper(getAllConstacs),
  getContactById: controlWrapper(getContactById),
  addContact: controlWrapper(addContact),
  updateContact: controlWrapper(updateContact),
  removeContact: controlWrapper(removeContact),
  updateContactStatus: controlWrapper(updateContactStatus),
};
