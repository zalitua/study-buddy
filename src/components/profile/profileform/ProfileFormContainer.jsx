// Profile Form Container - Profides the logic to handle
// the form from Profile Form, including updating a user's
// profile information and fetching it to display in the form
// if the profile is being edited.
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../../context/ProfileContext";
import ProfileForm from "./ProfileForm";
import { increment } from "firebase/firestore";

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

  // handling image upload from ProfilePic component
  const handleImageUpload = (url) => {
    setProfileImage(url);
  };

  // check required fields are filled out before allowing submission
  const validateForm = () => {
    if (!firstName || !lastName || !username) {
      toast.warn("Please fill out required fields.", {
        position: "top-center",
      });
      return false;
    }
    return true;
  };

  // handle saving the avatar configuration from the CustomAvatar component
  const handleSaveAvatar = (newAvatarConfig) => {
    setAvatarConfig(newAvatarConfig);
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // data to be uploaded
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
      points: increment(10),
    };

    // update the profile data in the database
    try {
      await updateProfileData(updatedData);
      //success message
      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 1000,
      });

      //points message
      toast.success(
        "Congratulations! You've earned 10 points for editing your profile"
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      // error message for failing to update the database
      toast.error("Failed to update profile!", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  // display ProfileForm component
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
