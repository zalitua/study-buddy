import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Chat from "./components/chat/Chat";
import Leaderboard from "./components/leaderboard/Leaderboard";
import ProfileForm from "./components/profile/ProfileForm";
import ProfilePage from "./components/profile/ProfilePage";
import UserList from "./components/profile/UserList";
import Calendar from "./components/calendar/Calendar";
import Home from "./components/home/Home";
import Tasks from "./components/tasks/Tasks";
import Group from "./components/group/Group";
import Sidebar from "./components/sidebar/Sidebar"; // Import the Sidebar
import { ProfileProvider } from "./context/ProfileContext";
import ForumHome from "./components/forum/ForumHome";
import ForumPage from "./components/forum/forumPages/ForumPages";

function App() {
  return (
    <Container fluid>
      <ToastContainer />
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
                <Route path="/profilePage/:userId" element={<ProfilePage />} />
                <Route path="/userList" element={<UserList />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/forumHome" element={<ForumHome />}/>
                <Route path="/forumHome/:forumId" element={<ForumPage />}/>{/*nav to a specific forum*/}
              </Routes>
            </ProfileProvider>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
