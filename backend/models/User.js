const mongoose = require("mongoose");

// Create a schema for user information
const userSchema = new mongoose.Schema({
  username: String,
});

// Create a model for the user
const User = mongoose.model("User", userSchema);

module.exports = User;
