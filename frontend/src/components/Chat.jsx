import React, { useState, useEffect, useRef } from "react";

import PropTypes from "prop-types";
import io from "socket.io-client";
import InputBox from "../utility/InputBox";
import Sidebar from "../utility/Sidebar";
import Messages from "../utility/Messages";
import PasswordModal from "../utility/PasswordModal";
import { toast } from "react-toastify";

const url = "https://x-chat-backend-ld6h.onrender.com";
// const url = "http://localhost:5000";

const socket = io.connect(url);

function Chat({ isDarkTheme, user }) {
  // State for messages
  const [messages, setMessages] = useState([]);
  // State for auto-scrolling
  const [toggleScroll, setToggleScroll] = useState(false);
  // State for current room
  const [currentRoom, setCurrentRoom] = useState();
  // State for rooms
  const [rooms, setRooms] = useState([]);
  // State for main chat area
  const [isMainChatEnabled, setIsMainChatEnabled] = useState(false);
  // State for join room modal
  const [showJoinRoomModal, setShowJoinRoomModal] = useState(false);
  // State for selected room
  const [selectedRoom, setSelectedRoom] = useState(null);
  // State for password
  const [password, setPassword] = useState("");

  useEffect(() => {
    socket.on("message", (newMessage) => {
      console.log("Received message:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => {
      socket.off("message");
    };
  }, [toggleScroll, currentRoom, messages]);

  useEffect(() => {
    socket.emit("roomList");
    socket.on("roomList", (roomList) => {
      console.log("Room list received:", roomList);
      setRooms(roomList);
    });
    return () => {
      socket.off("roomList");
    };
  }, [currentRoom]);

  useEffect(() => {
    fetch(`${url}/api/messages/getMessages/${currentRoom}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => console.error("Error fetching messages:", error));
  });

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
          toast("Incorrect password. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error checking room password:", error);
        toast(
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
        body: JSON.stringify({ roomName, password, isPrivate: true }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            toast(`Private chat room "${roomName}" created successfully!`);
          } else {
            toast("Failed to create private chat room. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error creating private chat room:", error);
          toast(
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
        <Sidebar
          createPrivateRoom={createPrivateRoom}
          rooms={rooms}
          isDarkTheme={isDarkTheme}
          joinRoom={joinRoom}
          currentRoom={currentRoom}
        />

        {/* Main chat area */}
        <div className="w-full sm:w-3/4 p-2">
          {!currentRoom ? (
            <div className="flex flex-col items-center justify-center h-[72vh]">
              <h2 className="text-2xl">Welcome to X-chat</h2>
              <h4 className="text-lg mt-4">
                {" "}
                Please join a room to start chatting
              </h4>
            </div>
          ) : (
            <Messages
              chatBoxRef={chatBoxRef}
              toggleScroll={toggleScroll}
              messages={messages}
              isDarkTheme={isDarkTheme}
              user={user}
            />
          )}
          {currentRoom && (
            <InputBox
              setToggleScroll={setToggleScroll}
              toggleScroll={toggleScroll}
              isDarkTheme={isDarkTheme}
              messages={messages}
              setMessages={setMessages}
              user={user}
              socket={socket}
              currentRoom={currentRoom}
            />
          )}
        </div>
      </div>

      {/* Join Room Modal */}
      {showJoinRoomModal && (
        <PasswordModal
          setPassword={setPassword}
          setShowJoinRoomModal={setShowJoinRoomModal}
          handleJoinRoom={handleJoinRoom}
          password={password}
        />
      )}
    </div>
  );
}

Chat.propTypes = {
  isDarkTheme: PropTypes.bool,
  user: PropTypes.string,
};

export default Chat;
