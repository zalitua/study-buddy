import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import "./Layout.css";

const Layout = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      {/* Flex container for Sidebar and Outlet */}
      <div className="d-flex align-items-start justify-content-center">
        {/* Sidebar */}
        <div className="sidebar-container p-3">
          <Sidebar />
        </div>

        {/* Main content (Outlet) */}
        <div className="outlet-container p-3 bg-light rounded shadow">
          <Outlet />
        </div>
      </div>
    </Container>
  );
};

export default Layout;
