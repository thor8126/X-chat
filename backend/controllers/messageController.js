const Message = require("../models/Message");

// Logic to get messages by room
exports.getMessages = async (req, res, next) => {
  const room = req.params.room;
  try {
    const messages = await Message.find({ room }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
};
