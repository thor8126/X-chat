// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.get("/getMessages/:room", messageController.getMessages);

module.exports = router;
