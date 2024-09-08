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

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Check
              type="radio"
              label="Female"
              name="gender"
              value="female"
              onChange={handleGenderChange}
              checked={gender === "female"}
            />
            <Form.Check
              type="radio"
              label="Male"
              name="gender"
              value="male"
              onChange={handleGenderChange}
              checked={gender === "male"}
            />
            <Form.Check
              type="radio"
              label="Nonbinary"
              name="gender"
              value="nonbinary"
              onChange={handleGenderChange}
              checked={gender === "nonbinary"}
            />
            <Form.Check
              type="radio"
              label="Other"
              name="gender"
              value="other"
              onChange={handleGenderChange}
              checked={gender === "other"}
            />

            {gender === "other" && (
              <Form.Group className="mt-2">
                <Form.Control
                  type="text"
                  placeholder="Please specify"
                  value={other}
                  onChange={(e) => setOther(e.target.value)} // Store in otherGender state
                />
              </Form.Group>
            )}
          </Form.Group>

          <div className="d-grid gap-2">
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
