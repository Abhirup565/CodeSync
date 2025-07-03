
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import axios from 'axios';
import MembersSideBar from '../components/MembersSideBar';
import TopBar from '../components/TopBar';
import ChatPanel from '../components/ChatPanel';
import MonacoEditor from '../components/MonacoEditor';
import ErrorPage from './ErrorPage';
import OutputBox from '../components/OutputBox';

export default function EditorPage({ setInvalidRoute }) {
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
  const [code, setCode] = useState("");
  const [loadingCode, setLoadingCode] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [output] = useState(`$ node factorial.js
Factorial of 5: 120

Process finished with exit code 0
Execution time: 0.032s`);

  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');


  const colorIndexRef = useRef(0);
  const color = ['#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#3B82F6'];

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
            color: color[(colorIndexRef.current++) % color.length]
          }
        )).sort((a, b) => (a.name.includes("(You)") ? -1 : b.name.includes("(You)") ? 1 : 0))
        );

        //fetch the latest code from db
        const codeRes = await axios.get(`http://localhost:7500/code/get-code?roomId=${roomId}`);
        setCode(codeRes.data.code || `//Welcome to Code sync - Collaborative Editor.
//Start coding together in real-time.
//Use chat section to have intuitive discusions.`);
        setLoadingCode(false);
      }
      catch (err) {
        if (err.response.status === 404) setRoomNotFound(true);
        if (err.response.status === 500) toast.error("Server error: Couldn't fetch room details.")
        setLoadingCode(false);
      }
    }
    fetchRoomData();
  }, []);

  const myMember = members.find(m => m.name.includes(username));
  const mycolor = myMember ? myMember.color : "#8884d8";

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
              color: color[(colorIndexRef.current++) % color.length]
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
    if (!chatOpen) {
      setUnseenMessages(0);
    }
  };

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
    roomNotFound ? (<ErrorPage setInvalidRoute={setInvalidRoute} />) :
      (<div className="h-screen bg-gray-900 text-gray-100 font-mono flex flex-col overflow-hidden">
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
          saving={saving}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Members */}
          <MembersSideBar members={members} />

          {/* Main Content Area */}
          {!loadingCode && <div className="flex-1 flex flex-col overflow-hidden">
            {/* Code Editor */}
            <MonacoEditor code={code} language={language} roomId={roomId} username={username} color={mycolor} setSaving={setSaving} />

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
            <OutputBox output={output} outputHeight={outputHeight} setOutputHeight={setOutputHeight} />
          </div>}

          {/* Chat Panel */}
          <ChatPanel
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            chatOpen={chatOpen}
          />
        </div>
      </div>)
  );
}