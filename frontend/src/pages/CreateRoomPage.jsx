import { useState } from "react";
import {
  Code,
  Copy,
  Shuffle,
  ArrowRight,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function CreateRoomPage({ setRoomsFetched, setLoadingRooms }) {
  const [roomTitle, setRoomTitle] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState({ value: 'javascript', label: 'JavaScript' });
  const [generatedRoomId, setGeneratedRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
  ];

  const generateRoomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const part1 = Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    const part2 = Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    const newRoomId = `ROOM-${part1}-${part2}`;
    setGeneratedRoomId(newRoomId);
  };

  const copyRoomId = async () => {
    if (generatedRoomId) {
      await navigator.clipboard.writeText(generatedRoomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navigate = useNavigate();
  const handleCreateRoom = async () => {
    if (!roomTitle.trim() || !generatedRoomId) return;

    setIsCreating(true);
    // Making API call
    try {
      const response = await axios.post("https://codesync-server-7x03.onrender.com/room/create-room", { roomTitle, selectedLanguage, generatedRoomId }, { withCredentials: true });
      toast.success(response.data.message);
      setIsCreating(false);
      setRoomsFetched(false);
      setLoadingRooms(true);
      navigate(`/editor/${generatedRoomId}`);
    }
    catch (err) {
      setIsCreating(false);
      if (err.response && err.response.status === 401) {
        toast.error(err.response.data.message);
        navigate('/login');
      }
      else
        toast.error(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12 mt-10">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Code className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">Create a Room</h1>
          <p className="text-gray-300 text-lg">
            Set up a new collaborative coding session for your team
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <div className="space-y-6">
            {/* Room Title */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Room Title
              </label>
              <input
                type="text"
                value={roomTitle}
                onChange={(e) => setRoomTitle(e.target.value)}
                placeholder="Enter room title"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
              />
            </div>

            {/* Programming Language */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Programming Language
              </label>
              <select
                value={selectedLanguage.value}
                onChange={(e) => {
                  const lang = languages.find(lan => lan.value === e.target.value);
                  setSelectedLanguage(lang);
                }}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value} className="bg-gray-900">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Room ID Generator */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-300">
                  Room ID
                </label>
                <button
                  onClick={generateRoomId}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                >
                  <Shuffle className="h-4 w-4" />
                  <span>Generate</span>
                </button>
              </div>

              {generatedRoomId ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generatedRoomId}
                    readOnly
                    className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                  <button
                    onClick={copyRoomId}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-3 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-gray-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Click "Generate" to create a unique room ID
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleCreateRoom}
            disabled={!roomTitle.trim() || !generatedRoomId || isCreating}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Room...</span>
              </>
            ) : (
              <>
                <span>Create Room</span>
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
              <h3 className="text-lg font-semibold text-white">Next Steps</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-gray-300">
                    <strong className="text-white">Share the Room ID</strong> with your teammates so they can join
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-gray-300">
                    <strong className="text-white">Start coding together</strong> in real-time with live cursor tracking
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-gray-300">
                    <strong className="text-white">Use built-in chat</strong> feature to communicate while coding
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}