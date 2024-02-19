
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    user: String,
    text: { type: String, required: true }, // Define text as a string type
    timestamp: { type: Date, default: Date.now }, // Add default value for timestamp
    room: String,
  });

  
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;


// Create a message schema


