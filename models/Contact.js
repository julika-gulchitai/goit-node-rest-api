import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";
import { emailRegexp } from "../constants/regexp.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Set email for contact"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Set phone number for contact"],
      unique: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", setUpdateSetting);
contactSchema.post("findOneAndUpdate", handleSaveError);

export const Contact = model("contact", contactSchema);
