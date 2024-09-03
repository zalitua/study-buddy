import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

//creates a context object to share authentication data
const userAuthContext = createContext();

//shares authentication data
export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  //adds a new user document to the users collection
  function addUser(email) {
    return setDoc(doc(db, "users", user.uid), {
      email,
      id: user.uid,
      //block[],  ...need to look this up
    });
  }

  //logs the user in if authenticated
  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  //creates a new user authentication entry
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  //logs a user out
  function logOut() {
    return signOut(auth);
  }
  //signs a user in using Google credentials
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  //creates useEffect hook to monitore the user's authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //wraps components that need access to the authentication-related data
  return (
    <userAuthContext.Provider
      //specifies states and functions to share with other components
      value={{ user, logIn, signUp, addUser, logOut, googleSignIn }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

//creates useContext hook to access values of userAuthContext.Provider
export function useUserAuth() {
  return useContext(userAuthContext);
}
