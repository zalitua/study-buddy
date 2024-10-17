import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useProfile } from "../../context/ProfileContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
//import Avatar from "react-nice-avatar";
import CustomAvatar from "../avatar/CustomAvatar";
import ProfilePic from "./ProfilePic";

const ProfileForm = () => {
  const { profileData, updateProfileData } = useProfile(); // Access profile and update functions from context
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
    profileData.avatarConfig || {}
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isEdit = firstName && lastName && username;

  const handleImageUpload = (url) => {
    setProfileImage(url);
  };

  // Validate required fields before submission
  const validateForm = () => {
    if (!firstName || !lastName || !username) {
      toast.warn("Please fill out required fields.", {
        position: "top-center",
      });
      return false;
    }
    return true;
  };

  // Function to handle avatar saving from CustomAvatar component
  const handleSaveAvatar = (newAvatarConfig) => {
    setAvatarConfig(newAvatarConfig); // Update avatar configuration
  };

  // Handle form submission to update profile data
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
      await updateProfileData(updatedData); // Use context to update profile
      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate("/dashboard"); // Redirect to home page
      }, 2000);
    } catch (error) {
      toast.error("Failed to update profile!", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="p-4 box  profile-form-container" style={{ height: "95vh" }}>
      <h2 className="mb-3">{isEdit ? "Edit Profile" : "Create Profile"}</h2>
      <h4 className="mb-3">Required Information:</h4>

      <Form onSubmit={handleSubmit}>
        {/* First Name */}
        <Form.Group className="mb-3" controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </Form.Group>

        {/* Last Name */}
        <Form.Group className="mb-3" controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </Form.Group>

        {/* Username */}
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <h4 className="mb-3">Optional Information:</h4>
        {/* Phone */}
        <Form.Group className="mb-3" controlId="formPhone">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            value={phone}
            placeholder="Phone Number"
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Group>

        {/* Date of Birth */}
        <Form.Group className="mb-3" controlId="formDate">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>

        {/* Gender */}
        <Form.Group className="mb-3" controlId="formGender">
          <Form.Label>Gender</Form.Label>
          <Form.Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="not specified">Please Select</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="nonbinary">Nonbinary</option>
            <option value="other">Other</option>
          </Form.Select>
        </Form.Group>

        {/* Other Gender Input */}
        {gender === "other" && (
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Please specify"
              value={other}
              onChange={(e) => setOther(e.target.value)}
            />
          </Form.Group>
        )}

        {/* Pronouns */}
        <Form.Group className="mb-3" controlId="formPronouns">
          <Form.Label>Pronouns</Form.Label>
          <Form.Select
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
          >
            <option value="not specified">Please Select</option>
            <option value="she/her">she/her</option>
            <option value="he/him">he/him</option>
            <option value="they/them">they/them</option>
            <option value="other">Other</option>
          </Form.Select>
        </Form.Group>

        {/* Other Pronouns Input */}
        {pronouns === "other" && (
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Please specify"
              value={otherPN}
              onChange={(e) => setOtherPN(e.target.value)}
            />
          </Form.Group>
        )}

        {/* Bio Input */}
        <Form.Group className="mb-3" controlId="formBio">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={bio}
            placeholder="Tell us about yourself..."
            onChange={(e) => setBio(e.target.value)}
          />
        </Form.Group>

        {/* Custom Avatar Creator*/}
        <CustomAvatar
          onSaveAvatar={handleSaveAvatar}
          avatarConfig={avatarConfig}
        />

        {/* Profile Picture Upload */}
        <div className="d-grid gap-2 mt-3">
          <h5>Upload Profile Picture</h5>
          {profileImage && (
            <img
              src={profileImage}
              alt="Profile"
              style={{ width: "70px", height: "70px", borderRadius: "50%" }}
            />
          )}
          <ProfilePic onImageUpload={handleImageUpload} />
        </div>

        {/* Submit Button */}
        <div className="d-grid gap-2 mt-3">
          <Button variant="primary" type="submit">
            {profileData ? "Update Profile" : "Create Profile"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProfileForm;
