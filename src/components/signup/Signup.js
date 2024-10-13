import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../../context/userAuthContext";
import { db } from "../../lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import Success from "./SuccessModal";
import { toast } from "react-toastify";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//Creates function for the sign up process
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, logIn } = useUserAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  let navigate = useNavigate();

  //Deals with submitting sign up information
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
      //Create user authentication entry
      const userCredential = await signUp(email, password);
      const newUser = userCredential.user;

      // Add the newly registered user to the users collection in the database
      await setDoc(
        doc(db, "users", newUser.uid),
        {
          email: newUser.email,
          uid: newUser.uid,
        },
        { merge: true }
      );
      await logIn(email, password);

      setShowSuccess(true);
    } catch (err) {
      toast.error("Login failed.", {
        position: "top-center",
      });
    }
  };

  //Handles closing the success modal and navigating to the dashboard
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/profileForm");
  };

  //Displays sign up form
  return (
    <>
      <div className="p-4 box">
        <h2 className="mb-3">StudyBuddy Signup</h2>
        {/*         {error && <Alert variant="secondary">{error}</Alert>}
         */}{" "}
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
              Sign up
            </Button>
          </div>
        </Form>
      </div>
      <div className="p-4 box mt-3 text-center">
        Already have an account? <Link to="/">Log In</Link>
      </div>
      <Success show={showSuccess} onClose={handleCloseSuccess} />
    </>
  );
};

export default Signup;
