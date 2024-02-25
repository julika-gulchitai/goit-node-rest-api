import User from "../models/User.js";

export const findUser = (filter) => User;
export const signup = (data) => User.create(data);
