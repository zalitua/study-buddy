import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import { UserAuthContextProvider } from "./context/userAuthContext";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";

function App() {
  return (

    <Container style={{ width: "400px" }}>
      <Row>
        <Col>
          <UserAuthContextProvider>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>

  );
}

export default App;
