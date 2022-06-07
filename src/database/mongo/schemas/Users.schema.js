const mongoose = require("mongoose");

const notificationPreferencesSchema = mongoose.Schema({
  email: { type: Boolean, default: true },
  push: { type: Boolean, default: true },
  promotional: { type: Boolean, default: true },
});

const addressSchema = mongoose.Schema({
  address: { type: String, default: "" },
  pincode: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
});

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, default: "" },
  socialIdentityProvider: {
    type: String, // 'google' or 'email' or 'phone'
    default: "",
  },
  phoneNumber: { type: Number, required: true, unique: true },
  isBanned: { type: Boolean, default: false }, // banned users
  name: { type: String, required: true },
  profileImage: { type: String, default: "" },
  address: { type: addressSchema },
  accountType: {
    type: String,
    default: "user",
    valid: ["hotelowner", "user"],
  },
  notificationPreferences: {
    type: notificationPreferencesSchema,
    default: { email: true, push: true, promotional: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("users", userSchema);
module.exports = User;
