// Protected Route makes sure a user is logged in before being
// allowed to view a page. If not logged in the user is redirected
// to the home page.
import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../../context/userAuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();

  // redirect to home page if not logged in
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
