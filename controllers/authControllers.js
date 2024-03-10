import * as authServices from "../services/authServices.js";
import * as userServices from "../services/userServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrWrapper from "../decorators/ctrWrapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail";

const { JWT_SECRET, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const verificationToken = nanoid();

  const newUser = await authServices.signUp(...req.body, verificationToken);

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target ="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await userServices.findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await userServices.updateUser(
    { _id: user._id },
    { verify: true, verificationToken: "null" }
  );
  res.json({ message: "Verify success" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await userServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target ="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email send success",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUser({ email });
  if (!user) {
    throw HttpError(401, "Invalid email or password");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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

export default {
  register: ctrWrapper(register),
  verify: ctrWrapper(verify),
  resendVerifyEmail: ctrWrapper(resendVerifyEmail),
  login: ctrWrapper(login),
  updateSubscription: ctrWrapper(updateSubscription),
  logout: ctrWrapper(logout),
  getCurrent: ctrWrapper(getCurrent),
};
