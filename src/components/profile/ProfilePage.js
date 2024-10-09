import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For capturing URL parameters
import { useProfile } from "../../context/ProfileContext";
import { Link } from "react-router-dom";
import defaultProfileImage from "../../assets/default-profile.png";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { userId } = useParams(); // Get userId from URL params, if provided
  const { profileData, fetchUserProfile, loading: userLoading } = useProfile(); // Access authenticated user profile data and loading state
  const [otherProfileData, setOtherProfileData] = useState(null); // For other user's profile data
  const [loading, setLoading] = useState(true); // Separate loading state

  useEffect(() => {
    const loadProfile = async () => {
      if (userId) {
        // If a userId is provided, fetch the other user's profile
        const userProfile = await fetchUserProfile(userId);
        setOtherProfileData(userProfile);
      }
      setLoading(false);
    };

    loadProfile();
  }, [userId, fetchUserProfile]);

  if (loading || userLoading) {
    return <div>Loading...</div>;
  }

  // Determine whether to show the authenticated user's profile or another user's
  const displayProfile = userId ? otherProfileData : profileData;

  if (!displayProfile) {
    return <div>No profile data available</div>;
  }

  return (
    <div className="Profile">
      <div className="upper-container">
        <h4>{displayProfile.username || "No username"}</h4>
        <div className="image-container">
          <img
            src={displayProfile.profileImageUrl || defaultProfileImage}
            alt="profile"
            height="100px"
            width="100"
          />
        </div>
      </div>
      <div className="lower-container">
        <br />
        <h2>
          {displayProfile.firstName || "No name"} {displayProfile.lastName}
        </h2>
        <h5>{displayProfile.pronouns || "pronouns not specified"}</h5>
        <h5>{displayProfile.gender || "gender not specified"}</h5>
        <h5>DOB: {displayProfile.date || "no DOB"}</h5>
        {displayProfile.email ? (
          <h5>
            <a href={`mailto:${displayProfile.email}`}>
              {displayProfile.email}
            </a>
          </h5>
        ) : (
          <h5>No email</h5>
        )}
        <p>{displayProfile.bio || "No bio available"}</p>

        {/* Only allow the authenticated user to edit their own profile */}
        {!userId && (
          <div className="edit-profile-link">
            <Link to="/ProfileForm">Edit Profile</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
