import User from "../models/User.js";

export const findUser = (filter) => User.findOne(filter);

export const findUserById = (id) => User.findById(id);

export const setSubscription = (id, subscription) =>
  User.findByIdAndUpdate(id, { subscription });

export const setAvatar = (id, avatarUrl) => {
  return User.findByIdAndUpdate(id, { avatarUrl });
};
