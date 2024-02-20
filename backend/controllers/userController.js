const User = require("../models/User");

// Logic to handle user login
exports.login = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      const newUser = new User({ username });
      await newUser.save();
      return res.json(newUser);
    }
    res.json(user);

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
