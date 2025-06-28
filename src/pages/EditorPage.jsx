
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  Terminal,
  Minus,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import MembersSideBar from '../components/MembersSideBar';
import TopBar from '../components/TopBar';
import ChatPanel from '../components/ChatPanel';
import MonacoEditor from '../components/MonacoEditor';

export default function EditorPage() {
  const { roomId } = useParams();
  // State management
  const [username, setUsername] = useState('');
  const [roomTitle, setRoomTitle] = useState('');
  const [language, setLanguage] = useState({});
  const [copied, setCopied] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [unseenMessages, setUnseenMessages] = useState(0);
  const [outputHeight, setOutputHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const [code, setCode] = useState(`// Welcome to CodeSync - Collaborative Editor
function calculateFactorial(n) {
  if (n <= 1) return 1;
  return n * calculateFactorial(n - 1);
}

// Test the function
console.log('Factorial of 5:', calculateFactorial(5));

// TODO: Add error handling for negative numbers
// TODO: Optimize for large numbers`);

  const [output] = useState(`$ node factorial.js
Factorial of 5: 120

Process finished with exit code 0
Execution time: 0.032s`);

  const color = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
  const [members, setMembers] = useState([]);

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState('');

  const resizeRef = useRef(null);

  //fetch all the room details when the component mounts
  useEffect(() => {
    async function fetchRoomData() {
      try {
        const user = await axios.get('http://localhost:7500/auth/profile', { withCredentials: true });
        const username = user.data.user.username;

        const res = await axios.post("http://localhost:7500/room/get-room-details", { roomId });
        setUsername(username);
        setRoomTitle(res.data.room_title);
        setLanguage(res.data.language);

        setMembers(res.data.members.map((member) => (
          {
            name: (member === username) ? `${member} (You)` : member,
            online: false,
            color: color[Math.floor(Math.random() * color.length)]
          }
        )).sort((a, b) => (a.name.includes("(You)") ? -1 : b.name.includes("(You)") ? 1 : 0))
        );
      }
      catch (err) {
        console.log(err);
      }
    }
    fetchRoomData();
  }, []);

  const chatOpenRef = useRef(chatOpen);
  useEffect(() => {
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  //webSocket setup
  const socketRef = useRef(null);

  useEffect(() => {
    if (!username || !roomId) return;
    socketRef.current = io('http://localhost:7500', { withCredentials: true });

    socketRef.current.emit('join-room', { roomId, username });

    socketRef.current.on('presence-update', ({ username, type }) => {
      setMembers(prev => {
        const exists = prev.find(m => m.name === username);
        if (type === "joined") {
          toast(`${username} joined`, {
            icon: '🥳',
          });
          if (exists) {
            return prev.map((m) => m.name === username ? { ...m, online: true } : m);
          }
          else {
            return [...prev, {
              name: username,
              online: true,
              color: color[Math.floor(Math.random() * color.length)]
            }];
          }
        }
        else if (type === "left") {
          toast(`${username} left`, {
            icon: '👋',
          });
          return prev.map(m => m.name === username ? { ...m, online: false } : m);
        }
      })
    });
    // get all the online users and update the members list
    socketRef.current.on('online-users', (onlineUsers) => {
      setMembers(prev =>
        prev.map(member => onlineUsers.includes(member.name.split(' ')[0]) ? { ...member, online: true } : member)
      );
    });
    // update the messages array when any new message received
    socketRef.current.on('receive-message', (data) => {
      setMessages(prev => [...prev,
      {
        id: prev.length + 1,
        sender: data.sender,
        message: data.message,
        isOwn: false
      }
      ]);
      if (!chatOpenRef.current) {
        setUnseenMessages(prev => prev + 1);
      }
    });
    return () => socketRef.current.disconnect();
  }, [username, roomId]);

  // Copy room ID functionality
  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle chat and reset unseen messages
  const toggleChat = () => {
    setChatOpen(!chatOpen);
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    if (!chatOpen) {
      setUnseenMessages(0);
    }
  };

  const chatRef = useRef(null);

  function isUserAtBottom(ref, threshold = 50) {
    if (!ref.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    return scrollHeight - (scrollTop + clientHeight) < threshold;
  }

  // Send message
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'You',
        message: newMessage.trim(),
        isOwn: true
      };
      setMessages([...messages, message]);
      setNewMessage('');

      socketRef.current.emit('send-message', { roomId, sender: username, message: message.message });
    }
  };

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newHeight = window.innerHeight - e.clientY;
      setOutputHeight(Math.max(100, Math.min(400, newHeight)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="h-screen bg-gray-900 text-gray-100 font-mono flex flex-col overflow-hidden">
      {/* Top Bar */}
      <TopBar
        roomTitle={roomTitle}
        language={language}
        roomId={roomId}
        copyRoomId={copyRoomId}
        copied={copied}
        chatOpen={chatOpen}
        toggleChat={toggleChat}
        unseenMessages={unseenMessages}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Members */}
        <MembersSideBar members={members} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Editor */}
          <MonacoEditor code={code} setcode={setCode} language={language} />

          {/* Resize Handle */}
          <div
            ref={resizeRef}
            className="h-1 bg-gray-700 hover:bg-gray-600 cursor-row-resize flex-shrink-0 relative group"
            onMouseDown={() => setIsResizing(true)}
          >
            <div className="absolute inset-x-0 -top-1 h-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Output/Terminal */}
          <div
            className="bg-black border-t border-gray-700 flex-shrink-0 flex flex-col"
            style={{ height: `${outputHeight}px` }}
          >
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">Output</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setOutputHeight(Math.max(100, outputHeight - 50))}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setOutputHeight(Math.min(400, outputHeight + 50))}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 text-white text-sm font-mono overflow-y-auto">
              <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {chatOpen && (<ChatPanel
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
          chatRef={chatRef}
        />)}
      </div>
    </div>
  );
}