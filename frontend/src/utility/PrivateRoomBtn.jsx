import React from "react";

function PrivateRoomBtn({createPrivateRoom,isDarkTheme}) {
  return (
    <>
      <div className="flex items-center mb-6">
        <button
          onClick={createPrivateRoom}
          className={`${
            isDarkTheme ? "bg-teal-700" : "bg-blue-500"
          } text-white px-4 py-2 rounded-md w-full text-md transform hover:scale-110 transition-transform duration-300`}
        >
          Create Private Room
        </button>
      </div>
    </>
  );
}

export default PrivateRoomBtn;
