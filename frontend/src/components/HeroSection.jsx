import { useEffect, useState } from "react";
import { Code, Users } from "lucide-react"
import { Link } from 'react-router-dom';

export default function HeroSection({ isLoggedIn }) {
  const [typewriterText, setTypewriterText] = useState('');

  useEffect(() => {
    const text = "Code Together, in Real Time";
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setTypewriterText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative px-6 overflow-hidden h-screen grid place-content-center" style={{ background: "url(/images/herosectionbg2.jpg)", backgroundRepeat: "no-repeat" }}>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white mt-10">
          {typewriterText}
          <span className="animate-pulse">|</span>
        </h1>

        <p className="text-xl md:text-1xl text-gray-300 mb-12 max-w-2xl mx-auto mt-15">
          Collaborate with developers seamlessly in a live coding environment. Write, edit, and code together in real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-15">
          <Link to={isLoggedIn ? "/join-room" : "/login"}><button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 cursor-pointer">
            <Users className="h-5 w-5" />
            <span>Join Room</span>
          </button></Link>
          <Link to={isLoggedIn ? "/create-room" : "/login"}><button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 cursor-pointer">
            <Code className="h-5 w-5" />
            <span>Create Room</span>
          </button></Link>
        </div>
      </div>
    </section>
  )
}