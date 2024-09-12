import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import {
  setDoc,
  doc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUserAuth } from "../../context/userAuthContext";
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

//creates a form to add profile information to a user
const Profile = () => {
  const { user } = useUserAuth(); //get the current user
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [gender, setGender] = useState("");
  const [other, setOther] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const points = 0; //set points to zero for new users

  //process gender data from radio buttons
  const handleGenderChange = (e) => {
    setGender(e.target.value);
    if (e.target.value !== "other") {
      setOther(""); // Reset the "Other" field when another option is selected
    }
  };

  //check if username is already taken
  const checkUsername = async (username) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; //return true if username exists
  };

  //submit button actions
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !username ||
      !phone ||
      !date ||
      !gender ||
      (gender === "other" && !other)
    ) {
      setError("Please fill out all items."); //error if not all fields completed
      return;
    }

    setError(""); //clear error message

    try {
      //make sure there is a current authenticated user
      if (!user) {
        setError("No authenticated user found!");
        return;
      }

      setError(""); //clear error message

      //check if username is taken
      const invalidUsername = await checkUsername(username);
      if (invalidUsername) {
        setError("That username is already in use. Please choos another.");
        return;
      }

      setError(""); //clear error message

      //write the profile image to the user's document in firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          firstName,
          lastName,
          username,
          phone,
          dateOfBirth: date,
          gender: gender === "other" ? other : gender,
          points,
          avatarUrl: selectedAvatar, // Save selected avatar URL
          uid: user.uid,
        },
        { merge: true }
      );

      await alert("Profile created successfully"); //success message
      navigate("/"); //go to home page
    } catch (err) {
      setError(err.message);
    }
  };

  //action for skip button - go straight to dashboard
  const handleSkip = () => {
    navigate("/"); //go to home page
  };

  //return form for entering profile information with an option to skip
  return (
    <>
      <div className="p-4 box">
        <h2 className="mb-3">Create Profile</h2>
        {error && <Alert variant="primary">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Phone Number"
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDate">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={date}
              placeholder="Date of Birth"
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGender">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="nonbinary">Nonbinary</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>

          {gender === "other" && (
            <Form.Group className="mt-2">
              <Form.Control
                type="text"
                placeholder="Please specify"
                value={other}
                onChange={(e) => setOther(e.target.value)}
              />
            </Form.Group>
          )}

          {/* Avatar Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Select Avatar</Form.Label>
            <Form.Control
              as="select"
              value={selectedAvatar}
              onChange={(e) => setSelectedAvatar(e.target.value)}
            >
              {avatarOptions.map((avatar, index) => (
                <option key={index} value={avatar}>
                  Avatar {index + 1}
                </option>
              ))}
            </Form.Control>
            <div className="mt-3">
              <img src={selectedAvatar} alt="Selected Avatar" width="100" />
            </div>
          </Form.Group>

          <div className="d-grid gap-2 mt-3">
            <h2>Upload Profile Picture</h2>
            <ProfilePic /> {/* Show the profile pic component here */}
          </div>
          <div className="d-grid gap-2 mt-3">
            <Button variant="primary" type="Submit">
              Create Profile
            </Button>
          </div>
        </Form>
        <div className="d-grid gap-2 mt-3">
          <Button variant="secondary" onClick={handleSkip}>
            Skip for now
          </Button>
        </div>
      </div>
    </>
  );
};

//export Profile function
export default Profile;
