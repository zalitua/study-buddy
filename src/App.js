import React from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UserAuthContextProvider } from "./context/userAuthContext";
import { ProfileProvider } from "./context/ProfileContext";

import AppRoutes from "./AppRoutes";

import "./App.css";

function App() {
  return (
    <UserAuthContextProvider>
      <ProfileProvider>
        <ToastContainer />
        <AppRoutes />
      </ProfileProvider>
    </UserAuthContextProvider>
  );
}

export default App;
