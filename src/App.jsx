import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
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

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false}/>
      <Router>
        <Navbar/>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/join-room" element={<JoinRoomPage/>}/>
          <Route path="/create-room" element={<CreateRoomPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<SignupPage/>}/>
          <Route path="/my-rooms" element={<MyRooms/>}/>
          <Route path="/editor/:roomId" element={<EditorPage/>}/>
        </Routes>
      </Router>
    </>
  );
}
export default App;
