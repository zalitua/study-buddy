import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import Chat from "./components/chat/Chat";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element = {<Chat />}/>
      </Routes>
    </Router>
  );
};

export default App;
