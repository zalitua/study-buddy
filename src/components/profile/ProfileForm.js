import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useProfile } from "../../context/ProfileContext"; // Import ProfileContext
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProfilePic from "./ProfilePic";
import avatar1 from "../../assets/avatar1.png";
import avatar2 from "../../assets/avatar2.png";
import avatar3 from "../../assets/avatar3.png";
import avatar4 from "../../assets/avatar4.png";
import avatar5 from "../../assets/avatar5.png";
import avatar6 from "../../assets/avatar6.png";
import avatar7 from "../../assets/avatar7.png";
import avatar8 from "../../assets/avatar8.png";
import avatar9 from "../../assets/avatar9.png";
import avatar10 from "../../assets/avatar10.png";

// Array of avatar image imports
const avatarOptions = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
];

const ProfileForm = () => {
  const { profileData, updateProfileData } = useProfile(); // Access profile and update functions from context
  const [firstName, setFirstName] = useState(profileData?.firstName || "");
  const [lastName, setLastName] = useState(profileData?.lastName || "");
  const [username, setUsername] = useState(profileData?.username || "");
  const [phone, setPhone] = useState(profileData?.phone || "");
  const [date, setDate] = useState(profileData?.date || "");
  const [gender, setGender] = useState(profileData?.gender || "");
  const [pronouns, setPronouns] = useState(profileData?.pronouns || "");
  const [other, setOther] = useState("");
  const [otherPN, setOtherPN] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(
    profileData?.avatarUrl || avatarOptions[0]
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      avatarUrl: selectedAvatar,
    };

    console.log(updatedData);

    try {
      await updateProfileData(updatedData); // Use context to update profile
      toast.success("Profile updated successfully!", {
        position: "top-center",
      });
      setTimeout(() => {
        navigate("/"); // Redirect to home page
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
    <div className="p-4 box profile-form-container">
      <h2 className="mb-3">Edit Profile</h2>

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

        {/* Avatar Selection */}
        <Form.Group className="mb-3">
          <Form.Label>Select Avatar</Form.Label>
          <div className="d-flex flex-wrap">
            {avatarOptions.map((avatar, index) => (
              <div key={index} className="m-2 text-center">
                <input
                  type="radio"
                  name="avatar"
                  value={avatar}
                  checked={selectedAvatar === avatar}
                  onChange={() => setSelectedAvatar(avatar)}
                  style={{ display: "none" }}
                  id={`avatar-${index}`}
                />
                <label htmlFor={`avatar-${index}`}>
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    width="50"
                    style={{
                      border:
                        selectedAvatar === avatar ? "2px solid blue" : "none",
                      cursor: "pointer",
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </Form.Group>

        {/* Profile Picture Upload */}
        <div className="d-grid gap-2 mt-3">
          <h2>Upload Profile Picture</h2>
          <ProfilePic />
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
