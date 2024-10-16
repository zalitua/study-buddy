import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/userAuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { logOut } = useUserAuth(); // Get the logOut function
  const navigate = useNavigate(); // Hook to navigate after logging out

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await logOut(); // Call logOut function from context
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Failed to log out:", error); // Handle errors if needed
    }
  };

  return (
    <div className="sidebar">
      <Nav className="flex-column p-3">
        <h4>StudyBuddy</h4>
        <Nav.Link as={NavLink} to="/">
          Home
        </Nav.Link>
        <Nav.Link as={NavLink} to="/dashboard">
          Dashboard
        </Nav.Link>
        <Nav.Link as={NavLink} to="/group">
          Group
        </Nav.Link>
        <Nav.Link as={NavLink} to="/leaderboard">
          Leaderboard
        </Nav.Link>
        <Nav.Link as={NavLink} to="/profilePage">
          Profile
        </Nav.Link>
        <Nav.Link as={NavLink} to="/calendar">
          Calendar
        </Nav.Link>
        <Nav.Link as={NavLink} to="/tasks">
          Tasks
        </Nav.Link>
        <Nav.Link as={NavLink} to="/forumHome">
          Forums
        </Nav.Link>
        <Nav.Link as="button" onClick={handleLogout}>
          Logout
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
