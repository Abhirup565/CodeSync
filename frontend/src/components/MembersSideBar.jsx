import {
  Users,
  LogOut,
  Circle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MembersSideBar({
  members,
  roomId,
  copyRoomId,
  showSidebar,
  setShowSidebar,
  language
}) {
  return (<>
    <div className="hidden w-64 bg-gray-800 border-r border-gray-700 md:flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Members ({members.filter(m => m.online).length}/{members.length})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.name}
              className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg transition-colors min-w-0"
              title={member.name}
            >
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                  style={{ backgroundColor: member.color }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
                {member.online && (
                  <Circle className="absolute -bottom-1 -right-1 h-3 w-3 text-green-400 fill-current" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium truncate block max-w-[10rem]">{member.name}</p>
                <p className="text-gray-400 text-xs">
                  {member.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <Link to="/my-rooms"><button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer">
          <LogOut className="h-4 w-4" />
          <span>Leave Room</span>
        </button></Link>
      </div>
    </div>

    {/*sidebar for mobile*/}
    {showSidebar && <div onClick={() => { setShowSidebar(false) }} className='absolute top-[61px] bottom-0 w-screen z-20'></div>}
    <div className={showSidebar ?
      "absolute z-20 md:hidden w-64 left-0 bottom-0 top-[61px] bg-gray-800 border-r border-gray-700 flex flex-col flex-shrink-0 transition-all duration-300"
      : "absolute z-20 md:hidden w-64 left-[-16rem] bottom-0 top-[61px] bg-gray-800 border-r border-gray-700 flex flex-col flex-shrink-0 transition-all duration-300"}>
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center">
          <Users className="h-4 w-4 mr-2" />
          Members ({members.filter(m => m.online).length}/{members.length})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.name}
              className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-lg transition-colors min-w-0"
              title={member.name}
            >
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                  style={{ backgroundColor: member.color }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
                {member.online && (
                  <Circle className="absolute -bottom-1 -right-1 h-3 w-3 text-green-400 fill-current" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium truncate block max-w-[10rem]">{member.name}</p>
                <p className="text-gray-400 text-xs">
                  {member.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <p className='mb-4'>Language: {language.label}</p>
        <p>Room ID:</p>
        <div className="flex items-center space-x-2 mb-10">
          <span className="text-gray-300 text-[16px]">{roomId}</span>
          <button
            onClick={copyRoomId}
            className="text-white text-[15px] bg-blue-600 rounded-lg py-1 px-2 ml-auto"
            title="Copy Room ID"
          >
            Copy
          </button>
        </div>
        <Link to="/my-rooms"><button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer">
          <LogOut className="h-4 w-4" />
          <span>Leave Room</span>
        </button></Link>
      </div>
    </div>
  </>
  )
}