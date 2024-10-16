import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/userAuthContext";
import { Button } from "react-bootstrap";

const Home = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/dashboard");
  }

  const handleNavLogin = async () => {
    try {
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNavSignup = async () => {
    try {
      navigate("/signup");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div>
        <h1>StudyBuddy</h1>
        <h2>Welcome to StudyBuddy!</h2>
        <div className="container-white">
          StudyBuddy is an interacitve environment designed to make organizing
          and managing your group projects easy and fun. By members being
          rewarded and recognized while using the app, they are encouraged to
          engage in a friendly, competitve and motivational space that will aid
          in increasing your teams productivity!
        </div>
      </div>
      <div>
        <Button variant="primary" onClick={handleNavLogin}>
          Login
        </Button>
        <Button variant="primary" onClick={handleNavSignup}>
          Sign Up
        </Button>
      </div>
    </>
  );
};

export default Home;
