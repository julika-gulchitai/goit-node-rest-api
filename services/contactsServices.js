import Contact from "../models/User.js";

export const listContacts = () => Contact.find();

// export async function listContacts() {
//   const list = await fs.readFile(contactsPath);
//   return JSON.parse(list);
// }

export async function getContactById(contactId) {
  const list = await listContacts();
  const contact = list?.find((contact) => contact.id === contactId);
  return contact || null;
}

export async function removeContact(contactId) {
  const list = await listContacts();
  const newList = list.filter((contact) => contact.id !== contactId);
  const deleteContact =
    list?.find((contact) => contact.id === contactId) || null;
  updatedListContacts(newList);
  return deleteContact;
}

export async function addContact(name, email, phone) {
  const list = await listContacts();
  if (list?.find((contact) => contact.name === name))
    return `Contact ${name} is already in the Contacts`;
  const newContact = { id: nanoid(), name, email, phone };
  list.push(newContact);
  updatedListContacts(list);
  return newContact;
}

export async function updateContact(id, body) {
  const list = await listContacts();
  const index = list.findIndex((contact) => contact.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...body };
  await updatedListContacts(list);
  return list[index];
}

export function updatedListContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}
