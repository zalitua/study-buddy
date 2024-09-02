import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import { UserAuthContextProvider } from "./context/userAuthContext";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";

import Chat from "./components/chat/Chat";
import Leaderboard from "./components/leaderboard/Leaderboard";
import Profile from "./components/profile/Profile";
import Calendar from "./components/calandar/Calendar";

function App() {
  return (
    //changed width value in my testing so my chat would take up the whole screen 
    <Container style={{ width: "2000px" }}> 
      <Row>
        <Col>
          <UserAuthContextProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/calendar" element={<Calendar />} />
            </Routes>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>

  );
}

export default App;
