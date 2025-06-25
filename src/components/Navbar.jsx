import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function Navbar(){
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const location = useLocation();
    useEffect(()=>{
        axios.get("http://localhost:7500/auth/profile", {withCredentials: true})
            .then((response)=>{
                setIsLoggedIn(response.data.user)}
            )
            .catch(()=> setIsLoggedIn(null));
    }, [location]);
    function isActive(path){
        return location.pathname === path;
    }
    
    return(
         location.pathname.startsWith("/editor") ? null : (
         <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 fixed w-screen z-20 font-mono">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Terminal className="h-8 w-8 text-green-400" />
                <span className="text-xl font-bold text-white">CodeSync</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className={isActive("/") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>Home</Link>
                <Link to={isLoggedIn ? "/join-room" : "/login"} className={isActive("/join-room") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>Join Room</Link>
                <Link to={isLoggedIn ? "/create-room" : "/login"} className={isActive("/create-room") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>Create Room</Link>
                <Link to="/my-rooms" className={isActive("/my-rooms") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>My Rooms</Link>
            </div>

            <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center cursor-pointer">
                    <span className="text-sm font-bold text-white">{isLoggedIn.firstname.charAt(0)}</span>
                </div>
                ) : (<>
                    <Link to="/login"><button className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                        Login
                    </button></Link>
                    <Link to="/register"><button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white transition-colors cursor-pointer">
                        Register
                    </button></Link>
                </>
                )}
            </div>
            </div>
        </nav>)
    )
}