// routes/roomRoutes.js
const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

router.post("/createRoom", roomController.createRoom);
router.post("/checkRoomPassword", roomController.checkRoomPassword);

module.exports = router;
