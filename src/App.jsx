import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import JoinRoomPage from './pages/JoinRoomPage';
import CreateRoomPage from "./pages/CreateRoomPage";
import ScrollToTop from './components/ScrollToTop';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import MyRooms from "./pages/MyRooms";
import EditorPage from "./pages/EditorPage";
import { useState } from "react";

function App() {
  const [roomsFetched, setRoomsFetched] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join-room" element={<JoinRoomPage setRoomsFetched={setRoomsFetched} setLoadingRooms={setLoadingRooms} />} />
          <Route path="/create-room" element={<CreateRoomPage setRoomsFetched={setRoomsFetched} setLoadingRooms={setLoadingRooms} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/my-rooms" element={<MyRooms
            roomsFetched={roomsFetched}
            setRoomsFetched={setRoomsFetched}
            rooms={rooms}
            setRooms={setRooms}
            loadingRooms={loadingRooms}
            setLoadingRooms={setLoadingRooms}
          />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
