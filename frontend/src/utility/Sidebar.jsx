import React from "react";
import { GoHome } from "react-icons/go";
import { FaLock } from "react-icons/fa";
import PrivateRoomBtn from "./PrivateRoomBtn";

function Sidebar({
  isDarkTheme,
  rooms,
  currentRoom,
  createPrivateRoom,
  joinRoom,
}) {
  return (
    <>
      <div
        className={`w-full sm:w-1/4 p-8 ${
          isDarkTheme
            ? "bg-neutral-800 text-white"
            : "bg-neutral-180 text-gray-700"
        }`}
      >
         <PrivateRoomBtn
          createPrivateRoom={createPrivateRoom}
          isDarkTheme={isDarkTheme}
        />

        <h2 className="text-xl font-bold mb-2 text-center">ROOMS</h2>
        {/* Sidebar content */}
        <ul className="space-y-4 mt-4">
          {rooms.map((room, id) => (
            <li
              key={id}
              className={`cursor-pointer capitalize ${
                room.name === currentRoom ? "font-bold" : ""
              }`}
              onClick={() => joinRoom(room)}
            >
              <span
                className={`flex items-center ${
                  isDarkTheme
                    ? "bg-neutral-700 text-white"
                    : "bg-gray-200 text-black"
                }  w-auto p-2 rounded-lg `}
              >
                <GoHome className="mr-2" />
                {room.name}
                {/* if privateRoom */}
                {room.isPrivate && (
                  <span className="ml-2 text-xs text-white px-2 py-1 rounded-md">
                    <FaLock className={`${isDarkTheme ? "text-white" : "text-black"}`}  />
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>

       
      </div>
    </>
  );
}

export default Sidebar;
