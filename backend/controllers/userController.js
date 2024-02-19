const User = require("../models/User");

// Logic to handle user login
exports.login = async (req, res, next) => {
  try {
    const { username, profilePic } = req.body;
    const user = new User({ username, profilePic });
    await user.save();
    res.status(201).json({ message: "User data saved successfully" });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Failed to save user data" });
  }
};

// Logic to fetch user data by username
exports.getUser = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};
