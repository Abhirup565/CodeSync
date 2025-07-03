import {
    LogOut
} from 'lucide-react';
export default function NavIconPopup({ user, handleLogout }) {

    return (
        <div className="flex flex-col items-center rounded-lg bg-slate-800 border border-gray-700 p-5 text-white">
            <div className="flex justify-center items-center rounded-full size-16 bg-green-600">
                <span className="text-xl">{user.firstname.charAt(0)}{user.lastname.charAt(0)}</span>
            </div>
            <div className="flex flex-col items-center mt-4">
                <p className="text-xl mb-1 font-bold">{user.firstname} {user.lastname}</p>
                <p className="text-gray-300 text-[15px]">Username: {user.username}</p>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer text-center w-full flex items-center justify-center p-2 mt-5 font-bold">
                <LogOut className='size-4' />&nbsp;
                <span>Sign out</span>
            </button>
        </div>
    )
}