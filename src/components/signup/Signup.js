import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useUserAuth } from "../../context/userAuthContext";
import { db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import Success from "./SuccessModal";
import { toast } from "react-toastify";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, logIn } = useUserAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      toast.warn("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      toast.warn("Password must be at least 8 characters long.");
      return;
    }

    try {
      const userCredential = await signUp(email, password);
      const newUser = userCredential.user;
      console.log("User created with UID:", newUser.uid); // Debug log

      await setDoc(doc(db, "users", newUser.uid), {
        email: newUser.email,
        uid: newUser.uid,
        points: 10
      });

      console.log("Firestore document created"); // Debug log

      await logIn(email, password);

      setShowSuccess(true);
      navigate("/dashboard");
      toast.success("10 points awarded for signing up!");
    } catch (err) {
      console.error("Signup error:", err); // Detailed error log
      toast.error("Signup failed: " + err.message);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/profileForm");
  };

  return (
    <>
      <div className="p-4 box">
        <h2 className="mb-3">StudyBuddy Signup</h2>
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
