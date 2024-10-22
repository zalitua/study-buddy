// Layout is a component that with it's counter part Outlet
// controls the sites layout. It is a specialized component
// from the React Router Dom library
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import "./Layout.css";

const Layout = () => {
  return (
    <div className="container-layout">
      <div className="sidebar-layout">
        {/* Sidebar content */}
        <Sidebar />
      </div>
      <div className="content-layout">
        {/* Main content */}
        <Outlet />{" "}
        {/* effedtively each page of the site is dispalyed through Outlet */}
      </div>
    </div>
  );
};

export default Layout;
