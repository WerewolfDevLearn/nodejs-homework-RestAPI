const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("crypto");

const contactsPath = path.resolve(__dirname, "./contacts.json");

async function getContacts() {
  try {
    const respons = await fs.readFile(contactsPath, "utf-8");
    const contactList = JSON.parse(respons);
    return contactList;
  } catch (error) {
    console.log(error);
  }
}

async function writeContacts(arrContacts) {
  await fs.writeFile(contactsPath, JSON.stringify(arrContacts, null, 2));
}

const listContacts = async () => {
  try {
    const contactList = await getContacts();
    return contactList;
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async contactId => {
  try {
    const contactList = await getContacts();
    const contact = contactList.find(contact => contact.id === contactId);
    return contact;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async contactId => {
  try {
    const contactList = await getContacts();
    const isID = contactList.some(contact => contact.id === contactId);
    console.log(isID);
    if (!isID) {
      console.error(`No such contact with id:${contactId}`);
      return;
    }
    const filtredContacts = contactList.filter(contact => contact.id !== contactId);
    await writeContacts(filtredContacts);
    return isID;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async ({ name, email, phone }) => {
  try {
    const contact = { id: crypto.randomUUID(), name, email, phone };
    const contactList = await getContacts();
    contactList.push(contact);
    writeContacts(contactList);
    return contact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contactList = await getContacts();
    const index = contactList.findIndex(contact => contact.id === contactId);
    if (index === -1) {
      console.error(`No such contact with id:${contactId}`);
      return;
    }
    const newContact = { ...contactList[index], ...body };
    contactList.splice(index, 1, newContact);
    writeContacts(contactList);
    return newContact;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
