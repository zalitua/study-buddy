import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import { UserAuthContextProvider } from './context/userAuthContext';
import './App.css';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Chat from './components/chat/Chat';
import Leaderboard from './components/leaderboard/Leaderboard';
import Profile from './components/profile/Profile';
import Calendar from './components/calendar/Calendar';
import Home from './components/home/Home';
import Tasks from './components/tasks/Tasks';
import Group from './components/group/Group';
import Sidebar from './components/sidebar/Sidebar'; // Import the Sidebar

function App() {
  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col xs={2} className="p-0">
          <Sidebar />
        </Col>

        {/* Main Content */}
        <Col xs={10}>
          <UserAuthContextProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/group" element={<Group />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/tasks" element={<Tasks />} />
            </Routes>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
