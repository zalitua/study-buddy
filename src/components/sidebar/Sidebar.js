import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="sidebar"
      style={{ width: "250px", height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <Nav className="flex-column p-3">
        <h4>StudyBuddy</h4>
        <Nav.Link as={NavLink} to="/">
          Home
        </Nav.Link>
        <Nav.Link as={NavLink} to="/dashboard">
          Dashboard
        </Nav.Link>
        <Nav.Link as={NavLink} to="/login">
          Login
        </Nav.Link>
        <Nav.Link as={NavLink} to="/signup">
          Signup
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
      </Nav>
    </div>
  );
};

export default Sidebar;
