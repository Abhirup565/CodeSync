import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import JoinRoomPage from './pages/JoinRoomPage';
import CreateRoomPage from "./pages/CreateRoomPage";
import ScrollToTop from './components/ScrollToTop';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"
import Navbar from "./components/Navbar";
function App() {
  return (
      <Router>
        <Navbar/>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/join-room" element={<JoinRoomPage/>}/>
          <Route path="/create-room" element={<CreateRoomPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<SignupPage/>}/>
        </Routes>
      </Router>
  );
}

export default App;
