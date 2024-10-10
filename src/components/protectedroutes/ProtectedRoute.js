import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
//import { toast } from "react-toastify";
//import "react-toastify/dist/ReactToastify.css";
import { useUserAuth } from "../../context/UserAuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();
  /* const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (!user && !toastShown) {
      toast.error("You must be logged in to access this page!", {
        position: "top-center",
        autoClose: 3000,
      });
      setToastShown(true);
    }
  }, [user, toastShown]); */

  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
