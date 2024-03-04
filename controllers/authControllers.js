import * as authServices from "../services/authServices.js";
import { findUser } from "../services/userServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrWrapper from "../decorators/ctrWrapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from jimp;
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()
const { JWT_SECRET } = process.env;
const avatarDir = 'avatar'

const register = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email, { s: '250'})

  const newUser = await authServices.signUp(req.body, avatarURL);

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Invalid email or password");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  
  if (!passwordCompare) {
    throw HttpError(401, "Invalid email or password");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  await authServices.setToken(user._id, token);
  res.json({ token, user: { email, subscription: user.subscription } });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json = { email, subscription };
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.setToken(_id);
  res.status(204);
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  await authServices.setSubscription(_id, subscription);
  res.json({ subscription });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(path.resolve('pablic', avatarDir), filename)
  await Jimp.read(oldPath)
    .then((av) => {
    return av.resize(250, 250).quality(60).write(newPath)
    }).catch((err) => console.log(err))
  
  const avatarURL = path.join(avatarDir, filename);
  await fs.rename(oldPath, newPath);

  await authServices.setAvatar(_id, newPath);
  res.json({ avatarURL: newPath});
};

export default {
  register: ctrWrapper(register),
  login: ctrWrapper(login),
  updateSubscription: ctrWrapper(updateSubscription),
  logout: ctrWrapper(logout),
  getCurrent: ctrWrapper(getCurrent),
  updateAvatar: ctrWrapper(updateAvatar)
};
