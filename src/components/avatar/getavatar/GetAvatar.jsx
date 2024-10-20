import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Avatar from "react-nice-avatar";
import "../CustomAvatar.css";
import { toast } from "react-toastify";

// get and display Avatar object
const GetAvatar = ({ userId }) => {
  const [avatarConfig, setAvatarConfig] = useState(null);

  // Fetch avatar configuration from Firestore for the given user ID
  useEffect(() => {
    const fetchAvatarConfig = async () => {
      if (userId) {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setAvatarConfig(userSnap.data().avatarConfig);
        } else {
          toast.error("Failed to upload avatar data!", {
            position: "top-center",
          });
        }
      }
    };

    fetchAvatarConfig();
  }, [userId]);

  // loading message
  if (!avatarConfig) {
    return <p>Loading avatar...</p>;
  }

  return (
    <div>
      <Avatar style={{ width: "6rem", height: "6rem" }} {...avatarConfig} />
    </div>
  );
};

export default GetAvatar;
