import React from 'react'

function PasswordModal({setPassword,setShowJoinRoomModal,handleJoinRoom,password}) {
  return (
    <>
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
    </>
  )
}

export default PasswordModal