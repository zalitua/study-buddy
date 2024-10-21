import React, { useState } from "react";
<<<<<<< HEAD:src/components/signup/Signup.js
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
=======
import { Modal, Button, Form } from "react-bootstrap";
>>>>>>> main:src/components/signup/SignupModal.jsx
import { useUserAuth } from "../../context/userAuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

<<<<<<< HEAD:src/components/signup/Signup.js
// Creates function for the sign up process
const Signup = () => {
=======
const SignupModal = ({ show, handleClose, setIsSigningUp }) => {
>>>>>>> main:src/components/signup/SignupModal.jsx
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, logIn } = useUserAuth();
  const navigate = useNavigate();

<<<<<<< HEAD:src/components/signup/Signup.js
  // Deals with submitting sign up information
=======
>>>>>>> main:src/components/signup/SignupModal.jsx
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
<<<<<<< HEAD:src/components/signup/Signup.js
=======
      setIsSigningUp(true);

>>>>>>> main:src/components/signup/SignupModal.jsx
      // Create user authentication entry
      const userCredential = await signUp(email, password);
      const newUser = userCredential.user;

<<<<<<< HEAD:src/components/signup/Signup.js
      // Add the newly registered user to the users collection in the database
      // and initialize their points
      await setDoc(
  doc(db, "users", newUser.uid),
  {
    email: newUser.email,
    uid: newUser.uid,
    points: 10  // Initialize user with 10 points upon signup
  },
  { merge: true }
);

      toast.success("Congratulations! You've earned 10 points for signing up.", {
        position: "top-center",
        autoClose: 3000,
      });

      await logIn(email, password);
      setShowSuccess(true);
    } catch (err) {
      toast.error("Signup failed. Please try again.", {
=======
      // Add the user to the Firestore 'users' collection
      await setDoc(
        doc(db, "users", newUser.uid),
        {
          email: newUser.email,
          uid: newUser.uid,
          points: 10,
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

      toast.success("Congratulations! You've earned 10 points for signing up.")

      setTimeout(() => {
        navigate("/profileForm");
        setIsSigningUp(false);
      }, 2000);

      handleClose();
    } catch (err) {
      toast.error("Signup failed.", {
>>>>>>> main:src/components/signup/SignupModal.jsx
        position: "top-center",
      });
      setIsSigningUp(false);
    }
  };

<<<<<<< HEAD:src/components/signup/Signup.js
  // Handles closing the success modal and navigating to the dashboard
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/profileForm");
  };

  // Displays sign up form
  return (
    <>
      <div className="p-4 box">
        <h2 className="mb-3">StudyBuddy Signup</h2>
=======
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
>>>>>>> main:src/components/signup/SignupModal.jsx
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
