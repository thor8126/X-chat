import React from 'react'
import { IoMdSend } from "react-icons/io";
import io from "socket.io-client";
// const url = "https://x-chat-backend-ld6h.onrender.com";
const url = "http://localhost:5000";

const socket = io.connect(url);

function InputBox({isDarkTheme,user,setMessages,currentRoom,joinRoom,leaveRoom,setToggleScroll,toggleScroll}) {
    const inputRef = React.useRef();
    const [message, setMessage] = React.useState("");
    

    const sendMessage = () => {
        if (message.trim() === "") return;
        if (!currentRoom) {
          alert("Please join a room first");
          return;
        };
        const newMessage = { text: message, user, timestamp: Date.now() ,room:currentRoom};
        console.log("newMessage:", newMessage);
        socket.emit("sendMessage", { message: newMessage });
        setMessage("");
        setToggleScroll(!toggleScroll);
        setMessages((prevMessages) => [...prevMessages, newMessage]); // Update messages state with the new message
      };

      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          if (message.startsWith("/join")) {
            const roomToJoin = message.split(" ")[1];
            joinRoom(roomToJoin);
          } else if (message === "/leave") {
            leaveRoom(currentRoom);
          } else {
            sendMessage();
          }
        }
      };

  return (
    <>
    <div
            className={`left-0 w-full h-[10vh] ${
              isDarkTheme ? "bg-neutral-800" : "bg-white"
            }`}
          >
            <div className="max-w-screen-md mx-auto px-4 py-2">
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className={`flex-1 p-3 rounded-xl
                   ${
                     isDarkTheme
                       ? "bg-neutral-700 text-white "
                       : "border bg-gray-100 text-black"
                   }`}
                />
                <button
                  onClick={sendMessage}
                  className={`ml-4 ${
                    isDarkTheme ? "bg-teal-700" : "bg-blue-500"
                  }  text-white rounded-full p-3 transform hover:scale-110 transition-transform duration-300`}
                >
                  <IoMdSend size={24} />
                </button>
              </div>
            </div>
          </div>
    </>
  )
}

export default InputBox