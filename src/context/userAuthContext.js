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

// Create a context object to share authentication data
const UserAuthContext = createContext();

// Share authentication data
export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  // Adds a new user document to the users collection
  async function addUser(email) {
    try {
      await setDoc(doc(db, "users", user.uid), {
        email,
        id: user.uid,
        // Add any additional fields here, like 'block', if necessary
      });
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
    }
  }

  // Logs the user in with email and password
  async function logIn(email, password) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error; // Rethrow error to handle it in the component where logIn is called
    }
  }

  // Creates a new user authentication entry with email and password
  async function signUp(email, password) {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  // Logs the user out
  async function logOut() {
    try {
      return await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  // Signs a user in using Google credentials
  async function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    try {
      return await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  // Monitor the user's authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state change detected", currentUser);
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Wrap components that need access to the authentication-related data
  return (
    <UserAuthContext.Provider
      // Specifies states and functions to share with other components
      value={{ user, logIn, signUp, addUser, logOut, googleSignIn }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

// Creates a hook to access values from UserAuthContext.Provider
export function useUserAuth() {
  return useContext(UserAuthContext);
}
