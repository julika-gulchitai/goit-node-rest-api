import express from "express";

import validateBody from "../helpers/validateBody.js";
import { signinSchema, singupSchema } from "../schemas/usersSchemas.js";}
const authRouter = express.Router();

export default authRouter;
