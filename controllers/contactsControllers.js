import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrWrapper from "../decorators/ctrWrapper.js";

export const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = limit * (page - 1);
  const { fav } = req.query;

  if (fav) {
    const amount = await contactsService.getContactCountByFilter({
      owner,
      fav,
    });
    const result = await contactsService.getContactByFilter(
      { owner, fav },
      { skip, limit }
    );
    res.json({ amount, result });
  } else {
    const amount = await contactsService.getContactCountByFilter({ owner });
    const result = await contactsService.getContactByFilter(
      { owner },
      { skip, limit }
    );
    res.json({ amount, result });
  }
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.getOneContactByFilter({
    _id: id,
    owner,
  });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.removeContactByFilter({
    _id: id,
    owner,
  });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  console.log(req.user);
  const result = await contactsService.addContact({ ...req.body, owner });
  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, (message = "Body must have at least one field"));
  }
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.updateContactByFilter(
    { _id: id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export const updateStatusContact = async (rec, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.updateStatusContactByFilter(
    { _id: id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export default {
  getAllContacts: ctrWrapper(getAllContacts),
  getOneContact: ctrWrapper(getOneContact),
  createContact: ctrWrapper(createContact),
  updateContact: ctrWrapper(updateContact),
  deleteContact: ctrWrapper(deleteContact),
  updateStatusContact: ctrWrapper(updateStatusContact),
};
