import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

export const authenticate = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} is not valid id`));
  }
  next();
};
