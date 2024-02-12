import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrWrapper from "../decorators/ctrWrapper.js";
import validateBody from "../helpers/validateBody.js";

export const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.json(result);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    const error = HttpError(404);
    res.status(error.status).json({ message: error.message });
  }
  res.json(result);
};

export const deleteContact = (req, res) => {
  const { id } = req.params;
  const result = contactsService.removeContact(id);
  if (!result) {
    const error = HttpError(404);
    res.status(error.status).json({ message: error.message });
  }
  res.json(result);
};

export const createContact = async (req, res) => {
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.updateContact(id, req.body);
  if (!result) {
    const error = HttpError(404);
    res.status(error.status).json({ message: error.message });
  }
  res.json(result);
};

export default {
  getAllContacts: ctrWrapper(getAllContacts),
  getOneContact: ctrWrapper(getOneContact),
  createContact: ctrWrapper(createContact),
  updateContact: ctrWrapper(updateContact),
  deleteContact: ctrWrapper(deleteContact),
};
