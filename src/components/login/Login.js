import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
//import GoogleButton from "react-google-button";
import { useUserAuth } from "../../context/userAuthContext";
import { toast } from "react-toastify";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//Creates a function to export that handles the Login process
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  //Deals with submitting the login information
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
      await logIn(email, password);
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 1000,
      });
      // Wait for toast to disappear before navigating
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      toast.error("Login failed. Please check your email and password.", {
        position: "top-center",
      });
    }
  };

  //Deals with submitting the Google login information
  /* const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      //Authenticate with Google credentials
      await googleSignIn();
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
    }
  }; */

  //Displays form for login options using react-bootstrap
  return (
    <>
      <div className="p-4 box">
        <h2 className="mb-3">StudyBuddy Login</h2>
        {/* {error && (
          <Alert variant="primary">
            Please enter your email and password. Your password must be at least
            8 characters long.
          </Alert>
        )} */}
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
        <hr />
        {/* comment */}
        {/* <div>
          <GoogleButton
            className="g-btn"
            type="dark"
            onClick={handleGoogleSignIn}
          />
        </div> */}
      </div>
      <div className="p-4 box mt-3 text-center">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </>
  );
};

export default Login;
