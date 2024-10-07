import React from "react";
import { useProfile } from "../../context/ProfileContext";
import { Link } from "react-router-dom";
import defaultProfileImage from "../../assets/default-profile.png";
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
        {" "}
        {/* display username */}
        <h4> {profileData.username || "No username"} </h4>
        <div className="image-container">
          {" "}
          {/* load profile image */}
          <img
            src={profileData.profileImageUrl || defaultProfileImage}
            alt="profile"
            height="100px"
            width="100"
          />
        </div>
      </div>
      <div className="lower-container">
        <br /> {/* display name */}
        <h2>
          {profileData.firstName || "No name"} {profileData.lastName}
        </h2>{" "}
        {/* display pronouns */}
        <h5>{profileData.pronouns || "pronouns not specified"} </h5>
        {/* display gender */}
        <h5>{profileData.gender || "gender not specified"}</h5>{" "}
        {/* display DOB */}
        <h5> DOB: {profileData.date || "no DOB"} </h5>
        {/* conditionally display email as a link */}
        {profileData.email ? (
          <h5>
            <a href={`mailto:${profileData.email}`}>{profileData.email}</a>
          </h5>
        ) : (
          <h5>No email</h5>
        )}{" "}
        {/* display bio */}
        <p> {profileData.bio || "No bio available"} </p>{" "}
        {/* link to edit profile form */}
        <div className="edit-profile-link">
          <Link to="/ProfileForm">Edit Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
