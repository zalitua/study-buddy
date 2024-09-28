import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profileData, setProfileData] = useState(null);

  const fetchProfileData = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setProfileData(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profileData, fetchProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
