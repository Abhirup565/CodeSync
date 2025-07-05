import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import {
  Code,
  Users,
  Copy,
  Trash2,
  Plus,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function MyRooms({
  roomsFetched, setRoomsFetched, rooms, setRooms, loadingRooms, setLoadingRooms, isLoggedIn
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterType, setFilterType] = useState('all'); // 'all', 'created', 'joined'
  const [copiedId, setCopiedId] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    if (isLoggedIn && !roomsFetched) {
      axios.get("http://localhost:7500/room/get-rooms", { withCredentials: true })
        .then((res) => {
          const roomsArr = res.data.rooms.map(room => (
            {
              id: room.room_id,
              title: room.room_title,
              language: room.language,
              createdAt: room.createdAt,
              memberCount: room.members.length,
              type: room.createdBy === isLoggedIn.username ? 'created' : 'joined'
            }
          ));
          setRooms(roomsArr);
          setRoomsFetched(true);
          setLoadingRooms(false);
        })
        .catch((err) => {
          if (err.response && err.response.status === 500) {
            toast.error(err.response.data.message);
          }
          setRooms([]);
          setLoadingRooms(false);
        })
    }
  }, [isLoggedIn, roomsFetched]);

  const socket = useRef(null);
  useEffect(() => {
    socket.current = io('http://localhost:7500');

    socket.current.on('update-members', ({ roomId, count }) => {
      setRooms(prevRooms =>
        prevRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              memberCount: count
            };
          }
          return room;
        })
      );
    });
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    }
  }, []);

  const languages = {
    JavaScript: { name: 'JavaScript', default: 'javascript', color: 'bg-yellow-500' },
    Python: { name: 'Python', default: 'python', color: 'bg-blue-500' },
    TypeScript: { name: 'TypeScript', default: 'typescript', color: 'bg-blue-600' },
    Java: { name: 'Java', default: 'java', color: 'bg-orange-500' },
    'C++': { name: 'C++', default: 'cpp', color: 'bg-blue-700' },
    C: { name: 'C', default: 'c', color: 'bg-blue-700' },
    'C#': { name: 'C#', default: 'csharp', color: 'bg-purple-600' },
    Go: { name: 'Go', default: 'go', color: 'bg-cyan-500' },
    Rust: { name: 'Rust', default: 'rust', color: 'bg-orange-600' },
    PHP: { name: 'PHP', default: 'php', color: 'bg-indigo-500' },
    Ruby: { name: 'Ruby', default: 'ruby', color: 'bg-red-500' }
  };

  const copyRoomId = async (roomId) => {
    await navigator.clipboard.writeText(roomId);
    setCopiedId(roomId);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const deleteRoom = async (roomId) => {
    if (deleteConfirm === roomId) {
      try {
        const res = await axios.post("http://localhost:7500/room/delete-room", { roomId, username: isLoggedIn.username });
        toast.success(res.data.message);

        socket.current.emit('delete-room', { roomId });

        setRooms(rooms.filter(room => room.id !== roomId));
      } catch (err) {
        toast.error(err.response.data.message);
      }
      setDeleteConfirm('');
    } else {
      setDeleteConfirm(roomId);
      setTimeout(() => setDeleteConfirm(''), 3000);
    }
  };

  const navigate = useNavigate();
  const enterRoom = (roomId, roomTitle) => {
    toast.success(`Joined room: ${roomTitle}`);
    navigate(`/editor/${roomId}`);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || room.language.label === filterLanguage;
    const matchesType = filterType === 'all' || room.type === filterType;

    return matchesSearch && matchesLanguage && matchesType;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Empty State Component
  const EmptyState = () => (
    <div className="text-center py-20">
      <div className="bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <Code className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-4">No Rooms Yet</h2>
      <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
        You haven't created or joined any coding rooms yet.
      </p>

    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 mt-15">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Rooms</h1>
            <p className="text-gray-400">
              Manage your collaborative coding sessions
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <Link to={isLoggedIn ? "/create-room" : "/login"}><button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>Create Room</span>
            </button></Link>
            <Link to={isLoggedIn ? "/join-room" : "/login"}><button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 cursor-pointer">
              <Users className="h-4 w-4" />
              <span>Join Room</span>
            </button></Link>
          </div>
        </div>

        {loadingRooms && (
          <div className='animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid place-content-center'>
            <div className="animate-spin rounded-full size-10 border-b-3 border-white"></div>
          </div>
        )}

        {rooms.length > 0 && (
          <>
            {/* Filters and Search */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search rooms by title or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Language Filter */}
                <div className="lg:w-48">
                  <select
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors"
                  >
                    <option value="all">All Languages</option>
                    {Object.entries(languages).map(([key, lang]) => (
                      <option key={key} value={key}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div className="lg:w-48">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 transition-colors"
                  >
                    <option value="all">All Rooms</option>
                    <option value="created">Created by Me</option>
                    <option value="joined">Joined Rooms</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Rooms Grid */}
            {filteredRooms.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <div key={room.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors">
                    {/* Room Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
                          {room.title}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${languages[room.language.label]?.color || 'bg-gray-500'}`}></div>
                          <span className="text-sm text-gray-300">
                            {languages[room.language.label]?.name || room.language.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${room.type === 'created'
                          ? 'bg-blue-600 text-blue-100'
                          : 'bg-green-600 text-green-100'
                          }`}>
                          {room.type === 'created' ? 'Created' : 'Joined'}
                        </span>
                      </div>
                    </div>

                    {/* Room Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Room ID:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-300 font-mono">{room.id}</span>
                          <button
                            onClick={() => copyRoomId(room.id)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {copiedId === room.id ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-gray-300">{formatDate(room.createdAt)}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Members:</span>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{room.memberCount}</span>
                        </div>
                      </div>

                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => enterRoom(room.id, room.title)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm cursor-pointer"
                      >
                        Enter Room
                      </button>

                      <button
                        onClick={() => deleteRoom(room.id)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm cursor-pointer ${deleteConfirm === room.id
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          }`}
                      >
                        {deleteConfirm === room.id ? (
                          <div className="flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>Confirm</span>
                          </div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Rooms Found</h3>
                <p className="text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {rooms.length === 0 && !loadingRooms && <EmptyState />}
      </div>
    </div>
  );
}