// Profile Page Container - get's a user's profile information
// or a selected user's profile(if a paramter for userId is present)
// so that Profile Page can display an auth user profile or any
//other user's profile
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import ProfilePage from "./ProfilePage";
import { loadProfile } from "./loadProfile";

// logic for profilepage
const ProfilePageContainer = () => {
  const { userId } = useParams();
  const { profileData, fetchUserProfile, loading: userLoading } = useProfile();
  const [otherProfileData, setOtherProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // import and use laodProfile function
  useEffect(() => {
    loadProfile(userId, fetchUserProfile, setOtherProfileData, setLoading);
  }, [userId, fetchUserProfile]);

  // display loading message
  if (loading || userLoading) {
    return <div>Loading...</div>;
  }

  // determine which profile data to use based on userId ?
  const displayProfile = userId ? otherProfileData : profileData;

  // alternative display in case of no profile data
  if (!displayProfile) {
    return <div>No profile data available</div>;
  }

  // load and display profile page display format
  return (
    <div>
      <ProfilePage profileInfo={displayProfile} canEdit={!userId} />
    </div>
  );
};

export default ProfilePageContainer;
