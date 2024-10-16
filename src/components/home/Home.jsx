import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/userAuthContext";
import { Button } from "react-bootstrap";
import LoginModal from "../login/LoginModal";
import SignUpModal from "../signup/SignUpModal";

const Home = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const handleNavSignup = () => setShowSignup(true);

  return (
    <>
      <div>
        <h2>Welcome to StudyBuddy</h2>
        <div className="container-white">
          StudyBuddy is an interacitve environment designed to make organizing
          and managing your group projects easy and fun. By members being
          rewarded and recognized while using the app, they are encouraged to
          engage in a friendly, competitve and motivational space that will aid
          in increasing your teams productivity!
        </div>
      </div>
      <div className="button-container">
        <Button variant="primary" onClick={handleLoginModal}>
          Login
        </Button>
        <Button variant="primary" onClick={handleNavSignup}>
          Sign Up
        </Button>
      </div>
      {/* Import and show the login modal */}
      <LoginModal show={showLoginModal} handleClose={handleCloseLoginModal} />
      <SignUpModal show={showSignup} handleClose={() => setShowSignup(false)} />
    </>
  );
};

export default Home;
