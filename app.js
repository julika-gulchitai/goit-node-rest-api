import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import ElasticEmail from "@elasticemail/elasticemail-client";
import nodemailer from "nodemailer";
const app = express();

import { error } from "console";
const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env;
const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465, // 25, 465, 2525
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};
const transport = nodemailer.createTransport(nodemailerConfig);
const emailUkr = {
  from: UKR_NET_EMAIL,
  to: "hadew87911@hidelux.com",
  subject: "Test email",
  html: "<strong>Test email</strong>",
};
transport
  .sendMail(emailUkr)
  .then(() => console.log("Email send success"))
  .catch((error) => console.error(error.message));

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const { DB_HOST, PORT } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

const { ELASTICEMAIL_API_KEY, ELASTICEMAIL_FROM } = process.env;
const defaultClient = ElasticEmail.ApiClient.instance;
const { apikey } = defaultClient.authentications;
apikey.apiKey = ELASTICEMAIL_API_KEY;

const api = new ElasticEmail.EmailsApi();

let email = ElasticEmail.EmailMessageData.constructFromObject({
  Recipients: [new ElasticEmail.EmailRecipient("hadew87911@hidelux.com")],
  Content: {
    Body: [
      ElasticEmail.BodyPart.constructFromObject({
        ContentType: "HTML",
        Content: "<strong>Test email</strong>",
      }),
    ],
    Subject: "Test email",
    From: ELASTICEMAIL_FROM,
  },
});

const callback = function (error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log("API called successfully.");
  }
};
api.emailsPost(email, callback);
