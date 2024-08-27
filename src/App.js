import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> //this sets the login page as the
        default start point
        <Route path="/profile" element={<Profile />} /> //this indicates a route
        that leads to the profile page
      </Routes>
    </Router>
  );
};

export default App;
