import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUserAuth } from '../context/userAuthContext';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const { user } = useUserAuth(); // Access the authenticated user
  const [profileData, setProfileData] = useState(null);
  const [hoveredProfile, setHoveredProfile] = useState(null); // For viewing other users' profiles

  // Fetch the authenticated user's profile data
  const fetchProfileData = useCallback(async () => {
    if (!user) return;

    try {
      const docRef = doc(db, "users", user.uid); // 'users' collection
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfileData(docSnap.data()); // Store user's profile data in state
      } else {
        console.log("No profile found for current user.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, [user]); // Dependencies: user, since it may change if the auth state changes.

  // Function to fetch another user's profile data by their user ID
  const fetchUserProfile = async (userId) => {
    try {
      const docRef = doc(db, "users", userId); // Fetch from 'users' collection by user ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data(); // Return the other user's profile data
      } else {
        console.log("No profile found for this user.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching other user's profile:", error);
      return null;
    }
  };

  // Function to update the authenticated user's profile (optional)
  const updateProfileData = async (updatedData) => {
    if (!user) return;

    try {
      await setDoc(doc(db, "users", user.uid), updatedData, { merge: true });
      setProfileData((prevData) => ({ ...prevData, ...updatedData }));
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  // Fetch the authenticated user's profile when they log in
  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user, fetchProfileData]); // Now fetchProfileData is included as a dependency

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        hoveredProfile,
        setHoveredProfile,
        fetchUserProfile, // Fetch another user's profile
        updateProfileData, // Update authenticated user's profile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
