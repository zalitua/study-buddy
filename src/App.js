import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UserAuthContextProvider } from "./context/UserAuthContext";
import { ProfileProvider } from "./context/ProfileContext";

import Sidebar from "./components/sidebar/Sidebar";
import AppRoutes from "./AppRoutes";

import "./App.css";

function App() {
  return (
    <UserAuthContextProvider>
      <ProfileProvider>
        <ToastContainer />
        <Container fluid>
          <Row>
            {/* Sidebar */}
            <Col xs={2} md={1} className="p-0">
              <Sidebar />
            </Col>

            {/* Main Content */}
            <Col xs={10} md={12} className="this">
              <AppRoutes />
            </Col>
          </Row>
        </Container>
      </ProfileProvider>
    </UserAuthContextProvider>
  );
}

export default App;
