// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const messageRoutes = require("./routes/messageRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const Message = require("./models/Message");
const Room = require("./models/Room");
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});



// Routes
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

// Socket.io events
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendMessage", async (data) => {
    console.log("Received message:", data["message"]);
    const newMessage = new Message({
      user: data.message.user,
      text: data.message.text,
      timestamp: new Date(),
      room: data.message.room,
    });

    await newMessage.save();

    io.to(data.room).emit("message", newMessage);
  });

  socket.on("roomList", async () => {
      console.log("Fetching room list");
      const rooms = await Room.find({});
      const filteredRooms = rooms.map((room) => {
        return {
          name: room.roomName,
          isPrivate: room.isPrivate,
        };
      });
      io.emit("roomList",filteredRooms);
  });
  


  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });


  socket.on("error", (error) => {
    console.error("Error:", error);
  });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
