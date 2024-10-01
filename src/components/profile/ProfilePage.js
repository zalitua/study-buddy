import React from "react";
import { useProfile } from "../../context/ProfileContext";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { profileData, loading } = useProfile(); // Access profile data and loading state

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (!profileData) {
    return <div>No profile data available</div>; // Handle case if no profile data
  }

  return (
    <div className="Profile">
      <div className="upper-container">
        <div className="image-container">
          <img
            src={profileData.profileImageUrl || "default-avatar.png"}
            alt=""
            height="100px"
            width="100"
          />
        </div>
      </div>
      <div className="lower-container">
        <h3> {profileData.profileData.username} </h3>
        <h3>
          {" "}
          {profileData.profileData.firstName} {profileData.profileData.lastName}
          , {profileData.profileData.pronouns}{" "}
        </h3>
        <h3>
          {" "}
          {profileData.profileData.gender}, {profileData.age || " "}{" "}
        </h3>
        <h3> {profileData.email || "No email"} </h3>
        <p> {profileData.profileData.bio || "No bio available"} </p>
      </div>
    </div>
  );
};

export default ProfilePage;
