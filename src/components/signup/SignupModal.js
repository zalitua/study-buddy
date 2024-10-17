import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useUserAuth } from "../../context/userAuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignupModal = ({ show, handleClose, setIsSigningUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, logIn } = useUserAuth();
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
      setIsSigningUp(true);

      // Create user authentication entry
      const userCredential = await signUp(email, password);
      const newUser = userCredential.user;

      // Add the user to the Firestore 'users' collection
      await setDoc(
        doc(db, "users", newUser.uid),
        {
          email: newUser.email,
          uid: newUser.uid,
        },
        { merge: true }
      );

      // Automatically log the user in after sign-up
      await logIn(email, password);

      // Show success toast
      toast.success("Signup successful!", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/profileForm");
        setIsSigningUp(false);
      }, 2000);

      handleClose();
    } catch (err) {
      toast.error("Signup failed.", {
        position: "top-center",
      });
      setIsSigningUp(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
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
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignupModal;
