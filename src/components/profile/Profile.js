import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import {
  setDoc,
  doc,
  query,
  where,
  getDocs,
  collection,
  getDoc,
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
  const [pronouns, setPronouns] = useState("");
  const [other, setOther] = useState("");
  const [otherPN, setOtherPN] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileState, setProfileState] = useState(false);
  const navigate = useNavigate();

  const points = 0; //set points to zero for new users

  //check if username is already taken
  const checkUsername = async (username) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; //return true if username exists
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setError("No authenticated user found!");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.username) {
            // Profile exists
            setProfileState(true);
            // Populate state with existing data
            setFirstName(data.firstName || "");
            setLastName(data.lastName || "");
            setUsername(data.username || "");
            setPhone(data.phone || "");
            setDate(data.date || "");
            setGender(data.gender || "");
            setPronouns(data.pronouns || "");
            setOther(data.gender === "other" ? data.other : "");
            setOtherPN(data.pronouns === "other" ? data.otherPN : "");
            setSelectedAvatar(data.avatarUrl || avatarOptions[0]);
          }
        }
      } catch (err) {
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  //submit button actions
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileState) {
      if (!firstName || !lastName || !username) {
        setError("Please fill out required fields."); //error if not all fields completed
        return;
      }
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
      if (!profileState) {
        const invalidUsername = await checkUsername(username);
        if (invalidUsername) {
          setError("That username is already in use. Please choose another.");
          return;
        }
      }

      setError(""); //clear error message

      const profileData = {};

      if (!profileState) {
        profileData.firstName = firstName;
        profileData.lastName = lastName;
        profileData.username = username;
        profileData.points = points;
        profileData.uid = user.uid;
      }

      profileData.phone = phone;
      profileData.date = date;
      profileData.gender = gender === "other" ? other : gender;
      profileData.pronouns = pronouns === "other" ? otherPN : pronouns;

      //write the profile image to the user's document in firestore

      await setDoc(
        doc(db, "users", user.uid),
        {
          profileData,
        },
        { merge: true }
      );

      await alert(
        profileState
          ? "Profile updated successfully!"
          : "Profile created successfully!"
      ); //success message
      navigate("/"); //go to home page
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  //return form for entering profile information
  return (
    <>
      <div className="p-4 box">
        <h2 className="mb-3">
          {!profileState ? "Complete Profile" : "Create Profile"}
        </h2>
        {profileState && <h4 className="mb-3">Required Fields:</h4>}
        {error && <Alert variant="primary">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {profileState && (
            <>
              {/* input field for first name */}
              <Form.Group className="mb-3" controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Group>

              {/* input field for last name */}
              <Form.Group className="mb-3" controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Group>

              {/* input field for username */}
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
            </>
          )}

          <h4 className="mb-3">
            {profileState ? "Additional Information:" : "Optional Fields:"}
          </h4>
          {/* input field for phone number */}
          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder={phone || "Phone Number"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>

          {/* input field for date */}
          <Form.Group className="mb-3" controlId="formDate">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={date}
              placeholder="Date of Birth"
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>

          {/* dropdown menu for gender */}
          <Form.Group className="mb-3" controlId="formGender">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              {/* gender options */}
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="nonbinary">Nonbinary</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>

          {/* user provided gender option if other is selected */}
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

          {/* dropdown menu for pronouns */}
          <Form.Group className="mb-3" controlId="formPronouns">
            <Form.Label>Pronouns</Form.Label>
            <Form.Select
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
            >
              {/* pronoun options */}
              <option value="">Select Gender</option>
              <option value="she/her">Female</option>
              <option value="he/him">Male</option>
              <option value="they/them">Nonbinary</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>

          {/* user provided pronouns option if other is selected */}
          {pronouns === "other" && (
            <Form.Group className="mt-2">
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
      </div>
    </>
  );
};

//export Profile function
export default Profile;
