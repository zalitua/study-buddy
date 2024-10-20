import React from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import CustomAvatar from "../../avatar/CustomAvatar";
import ProfilePic from "./ProfilePic";

// form to gather profile information
const ProfileForm = ({
  profileData,
  firstName,
  lastName,
  username,
  phone,
  date,
  gender,
  pronouns,
  bio,
  other,
  otherPN,
  profileImage,
  avatarConfig,
  loading,
  handleImageUpload,
  handleSaveAvatar,
  setFirstName,
  setLastName,
  setUsername,
  setPhone,
  setDate,
  setGender,
  setPronouns,
  setBio,
  setOther,
  setOtherPN,
  handleSubmit,
  isEdit,
}) => {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container-center-content">
      <h2 className="mb-3">{isEdit ? "Edit Profile" : "Create Profile"}</h2>

      <div className="container-white-2">
        <Form onSubmit={handleSubmit}>
          <h4 className="mb-3">Required Information:</h4>
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
                style={{ width: "6rem", height: "6rem", borderRadius: "50%" }}
              />
            )}
            <ProfilePic onImageUpload={handleImageUpload} />
          </div>

          {/* Submit Button */}
          <div className="d-grid gap-2 mt-3">
            <Button variant="primary" type="submit">
              {profileData ? "Update Profile" : "Create Profile"}
            </Button>
            <br />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ProfileForm;
