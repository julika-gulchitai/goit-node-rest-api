import { Contact } from "../models/Contact.js";

export const listContacts = () => Contact.find();

export const getContactById = async (contactId) => Contact.findById(contactId);

export const getContactByFilter = async (filter, query = {}) =>
  Contact.find(filter, query);

export const getContactCountByFilter = async (filter) =>
  Contact.countDocuments(filter);

export const getOneContactByFilter = async (filter) => Contact.findOne(filter);

export const removeContact = async (contactId) =>
  Contact.findByIdAndDelete(contactId);

export const removeContactByFilter = async (filter) =>
  Contact.findOneAndDelete(filter);

export const addContact = async (data) => Contact.create(data);

export const updateContact = async (id, data) =>
  Contact.findByIdAndUpdate(id, data);

export const updateContactByFilter = async (filter, data) =>
  Contact.findByIdAndUpdate(filter, data);

export const updateStatusContact = async (id, body) =>
  Contact.findByIdAndUpdate(id, body);

export const updateStatusContactByFilter = async (filter, body) =>
  Contact.findByIdAndUpdate(filter, body);
