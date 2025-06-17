import { useState } from "react";
import { Terminal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();
    function isActive(path){
        return location.pathname === path;
    }
    
    return(
        <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 fixed w-screen z-20">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Terminal className="h-8 w-8 text-green-400" />
                <span className="text-xl font-bold text-white">CodeSync</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className={isActive("/") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>Home</Link>
                <Link to="/join-room" className={isActive("/join-room") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>Join Room</Link>
                <Link to="/create-room" className={isActive("/create-room") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>Create Room</Link>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">My Rooms</a>
            </div>

            <div className="flex items-center space-x-4">
                {!isLoggedIn ? (
                <>
                    <Link to="/login"><button className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                        Login
                    </button></Link>
                    <Link to="/register"><button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white transition-colors cursor-pointer">
                        Register
                    </button></Link>
                </>
                ) : (
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">U</span>
                </div>
                )}
            </div>
            </div>
        </nav>
    )
}