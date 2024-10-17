// Container.js
import React from "react";
import "./Container.css"; // Import the CSS file
import Sidebar from "../sidebar/Sidebar";

const Container = ({ children }) => {
  return (
    <div className="container">
      <div className="sidebar">
        {/* Sidebar content */}
        <Sidebar />
      </div>
      <div className="content">
        {/* Main content */}
        {children}
      </div>
    </div>
  );
};

export default Container;
