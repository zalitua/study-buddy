import React, { useState } from "react";
//import { Navigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    try {
      createUserWithEmailAndPassword(auth, email.value, password.value);
      setCurrentUser(true);
    } catch (error) {
      alert(error);
    }
  };
  /* if (currentUser) {
    return <Navigate to="../dashboard" />;
  } */
  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" placeholder="Email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default SignUp;
