import React, { useState, useEffect, useRef } from "react";


import PropTypes from "prop-types";
import io from "socket.io-client";
import InputBox from "../utility/InputBox";
import Sidebar from "../utility/Sidebar";
import Messages from "../utility/Messages";

const url = "https://x-chat-backend-ld6h.onrender.com";
// const url = "http://localhost:5000";

const socket = io.connect(url);

function Chat({ isDarkTheme, user }) {

  const [toggleScroll, setToggleScroll] = useState(false)

  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("general");
  const [rooms, setRooms] = useState([{ name: "general", isPrivate: false }]);
  console.log("rooms:", rooms);
  const [isMainChatEnabled, setIsMainChatEnabled] = useState(false);
  const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    socket.on("message", (newMessage) => {
      console.log("Received message:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => {
      socket.off("message");
    };
  }, [toggleScroll]);

  useEffect(() => {
    socket.emit("roomList")
    socket.on("roomList", (roomList) => {
      console.log("Room list received:", roomList);
      setRooms([...rooms, ...roomList]);
    });
    return () => {
      socket.off("roomList");
    };
  }, []);

 

  useEffect(() => {
    fetch(`${url}/api/messages/getMessages/${currentRoom}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, [currentRoom,toggleScroll]);

  const joinRoom = (room) => {
    if (room.isPrivate) {
      setSelectedRoom(room);
      setShowJoinRoomModal(true);
    } else {
      socket.emit("joinRoom", room.name);
      setCurrentRoom(room.name);
    }
  };

  const handleJoinRoom = () => {
    if (password.trim() === "") return;

    fetch(`${url}/api/rooms/checkRoomPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomName: selectedRoom.name, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          socket.emit("joinRoom", selectedRoom.name);
          setCurrentRoom(selectedRoom.name);
          setShowJoinRoomModal(false);
          setPassword(""); // Clear password input
        } else {
          alert("Incorrect password. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error checking room password:", error);
        alert(
          "An error occurred while checking room password. Please try again."
        );
      });
  };

  const leaveRoom = (room) => {
    socket.emit("leaveRoom", room);
    setCurrentRoom("general");
  };

  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

 

  const toggleMainChat = () => {
    setIsMainChatEnabled(!isMainChatEnabled);
  };

 

  const createPrivateRoom = () => {
    const roomName = prompt("Enter the name of the private room:");
    if (roomName) {
      const password = prompt("Enter the password for the private room:");
      fetch(`${url}/api/rooms/createRoom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName, password, isPrivate: true}),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert(`Private chat room "${roomName}" created successfully!`);
          } else {
            alert("Failed to create private chat room. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error creating private chat room:", error);
          alert(
            "An error occurred while creating private chat room. Please try again."
          );
        });
    }
  };

  return (
    <div
      className={`w-screen flex flex-col ${
        isDarkTheme ? "bg-neutral-800 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="flex flex-1">
        <Sidebar createPrivateRoom={createPrivateRoom} rooms={rooms} isDarkTheme={isDarkTheme} joinRoom={joinRoom} currentRoom={currentRoom} />
        
        {/* Main chat area */}
        <div className="w-full sm:w-3/4 p-2">
          <Messages toggleScroll={toggleScroll} isDarkTheme={isDarkTheme} messages={messages} user={user} />
          <InputBox setToggleScroll={setToggleScroll} toggleScroll={toggleScroll} isDarkTheme={isDarkTheme} messages={messages} setMessages={setMessages} user={user} socket={socket} currentRoom={currentRoom} />
        </div>
      </div>
      
      {/* Join Room Modal */}
      {showJoinRoomModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md text-black">
            <h2 className="text-lg font-bold mb-4">Join Private Room</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="block w-full p-2 mb-4 border rounded-md"
            />
            <div className="flex justify-end">
              <button
                onClick={handleJoinRoom}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Join
              </button>
              <button
                onClick={() => setShowJoinRoomModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Chat.propTypes = {
  isDarkTheme: PropTypes.bool,
  user: PropTypes.string,
};

export default Chat;
