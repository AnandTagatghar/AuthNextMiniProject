import mongoose, { Document, model, models, Schema, Types } from "mongoose";

export interface UserSchemaInterface extends Document {
  username: string;
  password: string;
  email: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  _id: Types.ObjectId;
}

const UserSchema = new Schema<UserSchemaInterface>({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, `Please provide username`],
  },
  password: {
    type: String,
    required: [true, `Please provide password`],
    trim: true,
  },
  email: {
    type: String,
    required: [true, `Please provide email`],
    trim: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      `Please provide valid email`,
    ],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    trim: true,
  },
  verificationTokenExpiry: {
    type: Date,
  },
  forgotPasswordToken: { type: String, trim: true },
  forgotPasswordTokenExpiry: { type: Date },
});

export const User =
  (models.users as mongoose.Model<UserSchemaInterface>) ||
  model("users", UserSchema);
