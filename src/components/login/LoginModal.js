import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useUserAuth } from "../../context/userAuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!emailRegex.test(email)) {
      toast.warn("Please enter a valid email address.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Check password length
    if (password.length < 8) {
      toast.warn("Password must be at least 8 characters long.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      await logIn(email, password);
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      handleClose(); // Close the modal after login
    } catch (err) {
      toast.error("Login failed. Please check your email and password.", {
        position: "top-center",
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>StudyBuddy Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              Log In
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
