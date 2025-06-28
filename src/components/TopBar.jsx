import {
  Terminal,
  Play,
  CheckCircle,
  Copy,
  MessageSquareText,
  X
} from 'lucide-react';
export default function TopBar({
  roomTitle,
  language,
  roomId,
  copyRoomId,
  copied,
  chatOpen,
  toggleChat,
  unseenMessages
}) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Terminal className="h-5 w-5 text-green-400" />
          <span className="font-bold text-white">CodeSync</span>
        </div>

        <div className="h-4 w-px bg-gray-600"></div>

        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold text-white">{roomTitle}</h1>
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">{language.label}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
          <Play className="h-4 w-4" />
          <span>Run</span>
        </button>

        <div className={`flex items-center space-x-2`}>
          <span className="text-gray-300 text-sm">{roomId}</span>
          <button
            onClick={copyRoomId}
            className="text-gray-400 hover:text-white transition-colors mr-20"
            title="Copy Room ID"
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <button
          onClick={toggleChat}
          className={`absolute right-6 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors cursor-pointer ${chatOpen && "border-2 border-gray-300"}`}
        >
          <MessageSquareText className="h-5 w-5" />
          {unseenMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unseenMessages}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}