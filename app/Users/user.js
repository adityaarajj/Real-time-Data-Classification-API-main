const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema for User
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: String,
});

module.exports = mongoose.model("User", UserSchema);
