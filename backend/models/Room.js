
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: String,
  password: String, 
  isPrivate: Boolean,
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
