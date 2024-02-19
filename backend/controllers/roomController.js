const bcrypt = require("bcrypt");
const Room = require("../models/Room");

// Logic to create a new room
exports.createRoom = async (req, res, next) => {
  try {
    const { roomName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newRoom = new Room({ roomName, password: hashedPassword , isPrivate: true});
    await newRoom.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error creating private chat room:", error);
    res.status(500).json({ error: "Failed to create private chat room" });
  }
};

// Logic to check room password
exports.checkRoomPassword = async (req, res, next) => {
  try {
    const { roomName, password } = req.body;
    const room = await Room.findOne({ roomName });
    if (!room) {
      return res.json({ success: false });
    }
    const isPasswordValid = await bcrypt.compare(password, room.password);
    res.json({ success: isPasswordValid });
  } catch (error) {
    console.error("Error checking room password:", error);
    res.status(500).json({ error: "Failed to check room password" });
  }
};
