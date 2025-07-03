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
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const [roomsFetched, setRoomsFetched] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [invalidRoute, setInvalidRoute] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:7500/auth/profile", { withCredentials: true })
      .then((response) => {
        setIsLoggedIn(response.data.user)
      }
      )
      .catch(() => {
        setIsLoggedIn(null);
        setLoadingRooms(false);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Navbar isLoggedIn={isLoggedIn} invalidRoute={invalidRoute} />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setLoadingRooms={setLoadingRooms} />} />
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
            isLoggedIn={isLoggedIn}
          />} />
          <Route path="/editor/:roomId"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} authLoading={authLoading}>
                <EditorPage setInvalidRoute={setInvalidRoute} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<ErrorPage setInvalidRoute={setInvalidRoute} />} /> {/*Catch-all route */}
        </Routes>
      </Router>
    </>
  );
}
export default App;
