import { useEffect, useState } from "react";
import { Terminal, AlignJustify, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import NavIconPopup from './NavIconPopup';
import axios from "axios";

export default function Navbar({ isLoggedIn, invalidRoute }) {
    const [showPopup, setShowPopup] = useState(false);
    const [showMobileNav, setShowMobileNav] = useState(false);
    const location = useLocation();

    function isActive(path) {
        return location.pathname === path;
    }
    useEffect(() => {
        setShowMobileNav(false);
    }, [location.pathname]);

    function handleLogout() {
        axios.post('https://codesync-server-7x03.onrender.com/auth/logout', {}, { withCredentials: true })
            .then((res) => {
                window.location.href = '/';
            })
    }

    return (
        (location.pathname.startsWith("/editor") || invalidRoute) ? null : (
            <div className="fixed z-30">
                <nav className="relative z-30 bg-gray-800 border-b border-gray-700 px-6 py-4 w-screen font-mono">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <Link to="/"><div className="flex items-center space-x-2">
                            <Terminal className="h-8 w-8 text-green-400" />
                            <span className="text-xl font-bold text-white">CodeSync</span>
                        </div></Link>

                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className={isActive("/") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>Home</Link>
                            <Link to={isLoggedIn ? "/join-room" : "/login"} className={isActive("/join-room") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>Join Room</Link>
                            <Link to={isLoggedIn ? "/create-room" : "/login"} className={isActive("/create-room") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>Create Room</Link>
                            <Link to="/my-rooms" className={isActive("/my-rooms") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>My Rooms</Link>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            {isLoggedIn ? (
                                <div onClick={() => { setShowPopup(prev => !prev) }} className="hidden w-10 h-10 bg-green-600 rounded-full md:flex items-center justify-center cursor-pointer">
                                    <span className="text-sm font-bold text-white">{isLoggedIn.firstname.charAt(0)}{isLoggedIn.lastname.charAt(0)}</span>
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
                        {/* avatar icon popup */}
                        {showPopup && <div className="hidden md:block absolute right-15 top-20">
                            <NavIconPopup user={isLoggedIn} handleLogout={handleLogout} />
                        </div>}

                        {/*navbar for mobile*/}
                        <div onClick={() => { setShowMobileNav(prev => !prev) }} className="md:hidden w-10 h-10 flex items-center justify-center">
                            <span className="text-sm font-bold text-white"><AlignJustify /></span>
                        </div>
                    </div>
                </nav>
                {/*navbar dropdown for mobile*/}
                <div className={showMobileNav ?
                    "absolute left-1/2 top-48 -translate-1/2 w-full bg-slate-900 md:hidden flex p-8 transition-all duration-300 opacity-100" :
                    "absolute left-1/2 top-[-10rem] -translate-1/2 w-full bg-slate-900 md:hidden flex p-8 transition-all duration-300 opacity-0"}>
                    <div className="flex flex-col space-y-6">
                        <Link to="/" className={isActive("/") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>Home</Link>
                        <Link to={isLoggedIn ? "/join-room" : "/login"} className={isActive("/join-room") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>Join Room</Link>
                        <Link to={isLoggedIn ? "/create-room" : "/login"} className={isActive("/create-room") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>Create Room</Link>
                        <Link to="/my-rooms" className={isActive("/my-rooms") ? "text-white" : "text-gray-300 hover:text-white transition-colors"}>My Rooms</Link>
                    </div>
                    <div className="ml-auto mr-6">
                        {isLoggedIn ? (
                            <div className="flex flex-col items-center">
                                <div className="size-12 bg-green-600 rounded-full md:hidden flex items-center justify-center cursor-pointer mb-4">
                                    <span className="font-bold text-white">{isLoggedIn.firstname.charAt(0)}{isLoggedIn.lastname.charAt(0)}</span>
                                </div>
                                <p className="text-xl text-white mb-1 font-bold truncate max-w-[14rem]">{isLoggedIn.firstname} {isLoggedIn.lastname}</p>
                                <p className="text-gray-300 text-[15px]">Username: {isLoggedIn.username}</p>
                                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer text-center text-sm w-full flex items-center justify-center pt-2 pb-2 mt-5 font-bold">
                                    <LogOut className='size-4' />&nbsp;
                                    <span>Sign out</span>
                                </button>
                            </div>
                        ) : (<div className="flex flex-col justify-center space-y-4">
                            <Link to="/login"><button className="bg-slate-700 px-4 py-2 rounded-md text-gray-300 hover:text-white transition-colors cursor-pointer">
                                Login
                            </button></Link>
                            <Link to="/register"><button className="bg-green-600 px-4 py-2 rounded-md text-white transition-colors cursor-pointer">
                                Register
                            </button></Link>
                        </div>
                        )}
                    </div>
                </div>
            </div>)
    )
}