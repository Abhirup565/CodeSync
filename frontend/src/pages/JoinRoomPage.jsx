import React, { useState } from 'react';
import {
  Users,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function JoinRoomPage({
  setRoomsFetched, setLoadingRooms
}) {
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const navigate = useNavigate();
  const handleJoinRoom = async () => {
    if (!roomId.trim()) return;

    setIsJoining(true);
    // Simulate API call
    try {
      const response = await axios.post("https://codesync-server-sing.onrender.com/room/join-room", { roomId }, { withCredentials: true });
      toast.success(response.data.message);
      setIsJoining(false);
      setRoomsFetched(false);
      setLoadingRooms(true);
      navigate(`/editor/${roomId}`);
    }
    catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error(err.response.data.message);
        navigate("/login");
      }
      else
        toast.error(err.response.data.message);
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      {/* <Navbar/> */}

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12 mt-10">
          <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">Join a Room</h1>
          <p className="text-gray-300 text-lg">
            Enter the room ID to start collaborating with your team
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Room ID
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID (e.g., ROOM-1234-ABCD)"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors"
            />
          </div>

          <button
            onClick={handleJoinRoom}
            disabled={!roomId.trim() || isJoining}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            {isJoining ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Joining...</span>
              </>
            ) : (
              <>
                <span>Join Room</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>

        {/* Guiding Steps */}
        <div className="mt-12">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Info className="h-5 w-5 text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">How to Join a Room</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-gray-300">
                    <strong className="text-white">Get the Room ID</strong> from your teammate who created the room
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-gray-300">
                    <strong className="text-white">Enter the Room ID</strong> in the field above (format: ROOM-XXXX-XXXX)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-gray-300">
                    <strong className="text-white">Click Join Room</strong> and you'll be connected instantly to start coding together
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400">
            Don't have a room ID?
            <Link to="/create-room"><button className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer ml-3">
              Create a new room
            </button></Link>
          </p>
        </div>
      </div>
    </div>
  );
}