import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import { UserAuthContextProvider } from './context/userAuthContext'; // Correct import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProfileProvider } from "./context/ProfileContext";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./components/home/Home"; // Import Home
import Dashboard from "./components/dashboard/Dashboard"; // Import Dashboard
import Login from "./components/login/Login"; // Import Login
import Signup from "./components/signup/Signup"; // Import Signup
import Chat from "./components/chat/Chat"; // Import Chat
import Group from "./components/group/Group"; // Import Group
import Leaderboard from "./components/leaderboard/Leaderboard"; // Import Leaderboard
import ProfileForm from "./components/profile/ProfileForm"; // Import ProfileForm
import ProfilePage from "./components/profile/ProfilePage"; // Import ProfilePage
import Calendar from "./components/calendar/Calendar"; // Import Calendar
import Tasks from "./components/tasks/Tasks"; // Import Tasks
import "./App.css";

function App() {
  return (
    <UserAuthContextProvider>
      <ProfileProvider>
        <ToastContainer />
        <Container fluid>
          <Row>
            {/* Sidebar */}
            <Col xs={2} md={1} className="p-0">
              <Sidebar />
            </Col>

            {/* Main Content */}
            <Col xs={10} md={12} className="this">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/chat/:groupId/:chatId" element={<Chat />} />
                <Route path="/group" element={<Group />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profileForm" element={<ProfileForm />} />
                <Route path="/profilePage" element={<ProfilePage />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/tasks" element={<Tasks />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </ProfileProvider>
    </UserAuthContextProvider>
  );
}

export default App;
