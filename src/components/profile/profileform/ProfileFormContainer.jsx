import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../../context/ProfileContext";
import ProfileForm from "./ProfileForm";

const ProfileFormContainer = () => {
  const { profileData, updateProfileData } = useProfile();
  const [firstName, setFirstName] = useState(profileData?.firstName || "");
  const [lastName, setLastName] = useState(profileData?.lastName || "");
  const [username, setUsername] = useState(profileData?.username || "");
  const [phone, setPhone] = useState(profileData?.phone || "");
  const [date, setDate] = useState(profileData?.date || "");
  const [gender, setGender] = useState(profileData?.gender || "");
  const [pronouns, setPronouns] = useState(profileData?.pronouns || "");
  const [bio, setBio] = useState(profileData?.bio || "");
  const [other, setOther] = useState("");
  const [otherPN, setOtherPN] = useState("");
  const [profileImage, setProfileImage] = useState(
    profileData?.profileImageUrl
  );
  const [avatarConfig, setAvatarConfig] = useState(
    profileData?.avatarConfig || {}
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isEdit = firstName && lastName && username;

  const handleImageUpload = (url) => {
    setProfileImage(url);
  };

  const validateForm = () => {
    if (!firstName || !lastName || !username) {
      toast.warn("Please fill out required fields.", {
        position: "top-center",
      });
      return false;
    }
    return true;
  };

  const handleSaveAvatar = (newAvatarConfig) => {
    setAvatarConfig(newAvatarConfig);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const updatedData = {
      firstName,
      lastName,
      username,
      phone,
      date,
      gender: gender === "other" ? other : gender,
      pronouns: pronouns === "other" ? otherPN : pronouns,
      bio,
      avatarConfig,
    };

    try {
      await updateProfileData(updatedData);
      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error("Failed to update profile!", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileForm
      profileData={profileData}
      firstName={firstName}
      lastName={lastName}
      username={username}
      phone={phone}
      date={date}
      gender={gender}
      pronouns={pronouns}
      bio={bio}
      other={other}
      otherPN={otherPN}
      profileImage={profileImage}
      avatarConfig={avatarConfig}
      loading={loading}
      handleImageUpload={handleImageUpload}
      handleSaveAvatar={handleSaveAvatar}
      setFirstName={setFirstName}
      setLastName={setLastName}
      setUsername={setUsername}
      setPhone={setPhone}
      setDate={setDate}
      setGender={setGender}
      setPronouns={setPronouns}
      setBio={setBio}
      setOther={setOther}
      setOtherPN={setOtherPN}
      handleSubmit={handleSubmit}
      isEdit={isEdit}
    />
  );
};

export default ProfileFormContainer;
