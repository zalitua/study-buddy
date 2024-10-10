import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import { UserAuthContextProvider } from './context/userAuthContext'; // Correct import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UserAuthContextProvider } from "./context/UserAuthContext";
import { ProfileProvider } from "./context/ProfileContext";


import Sidebar from "./components/sidebar/Sidebar";
import AppRoutes from "./AppRoutes";
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
          <UserAuthContextProvider>
            <ProfileProvider>
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
            </ProfileProvider>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
