import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../../context/userAuthContext";
import Success from "./SuccessModal";

//Creates function for the sign up process
const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, addUser, logIn } = useUserAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  let navigate = useNavigate();

  //Deals with submitting sign up information
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      //Create user authentication entry
      await signUp(email, password);
      //Add the newly registered user to the users collection in the database
      await addUser(email);
      await logIn(email, password);
      setShowSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  //Handles closing the success modal and navigating to the dashboard
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/");
  };

  //Displays sign up form
  return (
    <>
      <div className="p-4 box">
        <h2 className="mb-3">StudyBuddy Signup</h2>
        {error && <Alert variant="danger">{error}</Alert>}
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
