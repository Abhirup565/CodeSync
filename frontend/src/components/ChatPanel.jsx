import {
    Triangle
} from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

export default function ChatPanel({
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    chatOpen
}) {
    const chatRef = useRef(null);
    const [atBottom, setAtBottom] = useState(true);

    useEffect(() => {
        const ele = chatRef.current
        if (ele) {
            ele.scrollTop = ele.scrollHeight;
        }
        const handleScroll = () => {
            const threshold = 50;
            const isBottom = ele.scrollHeight - ele.scrollTop - ele.clientHeight < threshold;
            setAtBottom(isBottom);
        };
        ele.addEventListener("scroll", handleScroll);
        return () => ele.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const ele = chatRef.current;
        if (!ele || messages.length === 0) return;
        const lastMsg = messages[messages.length - 1];

        if (lastMsg.isOwn || atBottom) {
            requestAnimationFrame(() => {
                ele.scrollTop = ele.scrollHeight;
                console.log("scrolled");
            });
        }
    }, [messages]);

    return (
        <div className={chatOpen ? "relative right-0 w-80 bg-gray-800 border-l border-gray-700 flex flex-col h-full z-10 transition-all duration-400" : "opacity-0 w-80 bg-gray-800 border-l border-gray-700 flex flex-col h-full z-10 mr-[-20rem] transition-all duration-400"}>
            <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Team Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.isOwn ? 'items-end self-end' : 'items-start self-start'} mb-5 w-full`}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-white">{msg.sender}</span>
                        </div>
                        <div className={`max-w-full break-words overflow-hidden ${msg.isOwn ? 'bg-blue-600 rounded-tr-none' : 'bg-gray-700 rounded-tl-none'} rounded-lg p-3`}>
                            <p className="text-sm text-white">{msg.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors text-sm"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors cursor-pointer"
                    >
                        <Triangle className="size-4" fill='currentColor' />
                    </button>
                </div>
            </div>
        </div>
    )
}