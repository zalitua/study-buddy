import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import ProfilePage from "./ProfilePage";
import { loadProfile } from "./loadProfile";

const ProfilePageContainer = () => {
  const { userId } = useParams();
  const { profileData, fetchUserProfile, loading: userLoading } = useProfile();
  const [otherProfileData, setOtherProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile(userId, fetchUserProfile, setOtherProfileData, setLoading);
  }, [userId, fetchUserProfile]);

  if (loading || userLoading) {
    return <div>Loading...</div>;
  }

  const displayProfile = userId ? otherProfileData : profileData;

  if (!displayProfile) {
    return <div>No profile data available</div>;
  }

  return (
    <div>
      <ProfilePage profileInfo={displayProfile} canEdit={!userId} />
    </div>
  );
};

export default ProfilePageContainer;
