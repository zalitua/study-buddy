import React from "react";
import { useProfile } from "../../context/ProfileContext";
import { Link } from "react-router-dom";
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
        <h4> {profileData.username} </h4>
        <div className="image-container">
          <img
            src={profileData.profileImageUrl || "default-avatar.png"}
            alt="profile"
            height="100px"
            width="100"
          />
        </div>
        {/* <div className="image-container">
          <img
            src={profileData.avatarURL || "default-avatar.png"}
            alt="avatar"
            height="100px"
            width="100"
          />
        </div> */}
      </div>
      <div className="lower-container">
        <br />
        <h2>
          {profileData.firstName} {profileData.lastName}
        </h2>
        <h5>{profileData.pronouns} </h5>
        <h5>
          {profileData.gender} {profileData.age || " "}{" "}
        </h5>
        <h5>
          <a href={`mailto:${profileData.email}`}>
            {profileData.email || "No email"}
          </a>
        </h5>
        <p> {profileData.bio || "No bio available"} </p>
        <div className="edit-profile-link">
          <Link to="/ProfileForm">Edit Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
