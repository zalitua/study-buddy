import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import "./Layout.css";

const Layout = () => {
  return (
    <div className="container">
      <div className="sidebar">
        {/* Sidebar content */}
        <Sidebar />
      </div>
      <div className="content">
        {/* Main content */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
