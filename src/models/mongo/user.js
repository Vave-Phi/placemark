import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  isAdmin: {
    default: false,
    type: Boolean,
  },
});

export const User = mongoose.model("User", userSchema);
