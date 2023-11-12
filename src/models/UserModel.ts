import mongoose from "mongoose";

const userShema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

const User = mongoose.model("User", userShema);

export default User;
