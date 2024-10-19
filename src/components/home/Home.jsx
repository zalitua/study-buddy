import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/userAuthContext";
import { Button } from "react-bootstrap";
import LoginModal from "../login/LoginModal";
import SignupModal from "../signup/SignupModal";

const Home = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    if (user && !isSigningUp) {
      navigate("/dashboard");
    }
  }, [user, navigate, isSigningUp]);

  const handleLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const handleSignupModal = () => setShowSignupModal(true);
  const handleCloseSignupModal = () => setShowSignupModal(false);

  return (
    <>
      <div>
        <h2>Welcome to StudyBuddy</h2>
        <div className="container-center-content">
          <div className="container-white-1">
            StudyBuddy is an interacitve environment designed to make organizing
            and managing your group projects easy and fun. By members being
            rewarded and recognized while using the app, they are encouraged to
            engage in a friendly, competitve and motivational space that will
            aid in increasing your teams productivity!
          </div>
        </div>
      </div>
      <div className="container-center-button">
        <Button variant="primary" onClick={handleLoginModal}>
          Login
        </Button>
        <Button variant="primary" onClick={handleSignupModal}>
          Sign Up
        </Button>
      </div>
      {/* Import and show the login modal */}
      <LoginModal show={showLoginModal} handleClose={handleCloseLoginModal} />
      <SignupModal
        show={showSignupModal}
        handleClose={handleCloseSignupModal}
        setIsSigningUp={setIsSigningUp}
      />
    </>
  );
};

export default Home;
