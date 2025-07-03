import { useEffect } from "react"
import { Terminal } from "lucide-react";

export default function ErrorPage({ setInvalidRoute }) {
    useEffect(() => {
        setInvalidRoute(true);
        return () => setInvalidRoute(false);
    }, []);
    return (
        <div className="w-screen h-screen bg-gray-900 grid place-content-center font-mono">
            <div className="flex mb-5 items-center"><Terminal className="text-green-400 md:size-8 size-10" /> <span className="text-white font-bold md:text-xl text-2xl">CodeSync</span></div>
            <h1 className="text-white md:text-4xl text-2xl font-bold"><span className="text-orange-400">404</span> | Page not found {":("}</h1>
        </div>
    )
}