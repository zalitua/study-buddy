import React from "react";
import { useProfile } from "../../context/ProfileContext";
import "./ProfilePage.css";

function ProfilePage() {
  const { profileData, loading } = useProfile();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>No profile data available.</div>;
  }

  return (
    <div className="Profile">
      <div className="upper-container">
        <div className="image-container">
          <img src={profileData.avatarUrl || "default-avatar.png"} alt="" height="100px" width="100" />
        </div>
      </div>
      <div className="lower-container">
        <h3> {profileData.username} </h3>
        <h3> {profileData.firstName} {profileData.lastName}, {profileData.pronouns} </h3>
        <h3> {profileData.gender}, {profileData.age || "Unknown"} </h3>
        <h3> {profileData.email || "No email"} </h3>
        <p> {profileData.bio || "No bio available"} </p>
      </div>
    </div>
  );
}

export default ProfilePage;
