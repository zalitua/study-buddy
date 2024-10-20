import React from "react";
import { Button, Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/userAuthContext";
import siteLogo from "../../assets/SBLogo.png";
import defaultProfileImage from "../../assets/default-profile.png";

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
    <div>
      <div className="logo-display">
        <img src={siteLogo} alt="profile" height="50px" width="50px" />
      </div>
      <Nav className="flex-column px-3 py-1">
        {/* <h4>StudyBuddy</h4> */}
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
        {/*<br />*/}
        <Button variant="light" onClick={handleLogout}>
          Logout
        </Button>
      </Nav>
    </div>
  );
};

export default Sidebar;
