import React from "react";
import { Link } from "react-router-dom";
import defaultProfileImage from "../../assets/default-profile.png";
import "./ProfilePage.css";
import GetAvatar from "../avatar/getavatar/GetAvatar";

// ProfilePage component to display user profile information
const ProfilePage = ({ profileInfo, canEdit }) => {
  return (
    <div className="container-display-horizontal">
      <div className="container-white-2">
        {/* Left container with username, profile image, and email */}
        <div className="container-left">
          <h4>{profileInfo.username || "No username"}</h4>
          <div className="image-container-1">
            <img
              src={profileInfo.profileImageUrl || defaultProfileImage}
              alt="profile"
              height="150px"
              width="150px"
            />
          </div>
          {/* conditionally render email as a mailto link if it exists */}
          {profileInfo.email ? (
            <h5>
              <a href={`mailto:${profileInfo.email}`}>{profileInfo.email}</a>
            </h5>
          ) : (
            <h5>No email</h5>
          )}
        </div>

        {/* Right container with avatar, name, pronouns, gender, DOB, and bio */}
        <div className="container-right">
          {/* get and display Avatar */}
          <GetAvatar userId={profileInfo.uid} />
          <h2>
            {profileInfo.firstName || "No name"} {profileInfo.lastName}
          </h2>
          <h5>{profileInfo.pronouns || "pronouns not specified"}</h5>
          <h5>{profileInfo.gender || "gender not specified"}</h5>
          <h5>DOB: {profileInfo.date || "no DOB"}</h5>
          <p>{profileInfo.bio || "No bio available"}</p>

          {/* Only allow the authenticated user to edit their own profile */}
          {canEdit && (
            <div className="edit-profile-link">
              <Link to="/ProfileForm">Edit Profile</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
