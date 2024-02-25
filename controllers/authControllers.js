import * as authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrWrapper from "../decorators/ctrWrapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signUp = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await authServices.signup(req.body);

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
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
  const token = jwt.sing(payload, JWT_SECRET, { expiresIn: "23h" });
  res.json({ token });
};

export default { signUp: ctrWrapper(signUp), signIn: ctrWrapper(signIn) };
