import express from "express";
import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { signinSchema, singupSchema } from "../schemas/usersSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";

const authRouter = express.Router();
authRouter.post(
  "/register",
  validateBody(singupSchema),
  authControllers.signUp
);
authRouter.post("/login", validateBody(singupSchema), authControllers.signIn);
authRouter.get(
  "/current",
  validateBody(singupSchema),
  authControllers.getCurrent
);
authRouter.post("/logout", validateBody(singupSchema), authControllers.signOut);
authRouter.patch(
  "/",
  validateBody(singupSchema),
  authControllers.changeSubscription
);

export default authRouter;
