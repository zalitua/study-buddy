import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Ensure correct calendar styling is imported
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useUserAuth } from "../../context/userAuthContext"; // Make sure this path is correct
import { db } from "../../lib/firebase"; // Ensure your Firebase setup is correct
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "./CalendarPage.css"; // Import your custom CSS

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Store selected date
  const [availabilities, setAvailabilities] = useState([]); // Store availabilities
  const [startTime, setStartTime] = useState(""); // Store start time
  const [endTime, setEndTime] = useState(""); // Store end time
  const [loading, setLoading] = useState(false); // Loading state for availability fetch
  const { user } = useUserAuth(); // Get current user from context
  const navigate = useNavigate(); // To navigate between pages

  // Fetch availabilities when the selected date or user changes
  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (!user) {
      toast.warn("You need to be logged in to view availabilities.");
      navigate("/login");
      return;
    }

    // Function to fetch availabilities for the selected date
    const fetchAvailabilities = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "availabilities"),
          where("date", "==", selectedDate.toDateString()) // Query for availabilities on the selected date
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => doc.data());
        setAvailabilities(data); // Set the availabilities in state
      } catch (err) {
        toast.error("Failed to fetch availabilities: " + err.message); // Show error toast
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities(); // Call the function to fetch availabilities
  }, [selectedDate, user, navigate]);

  // Handle date change in the calendar
  const handleDateChange = (date) => {
    setSelectedDate(date); // Update the selected date
  };

  // Handle adding new availability
  const handleAddAvailability = async () => {
    if (!startTime || !endTime) {
      toast.warn("Please fill in both start and end times.");
      return;
    }

    try {
      // Add new availability to the Firestore database
      await addDoc(collection(db, "availabilities"), {
        date: selectedDate.toDateString(),
        startTime,
        endTime,
        userId: user.uid,
        userName: user.displayName || user.email, // Use display name or email as fallback
      });

      toast.success("Availability added successfully!"); // Show success toast
      setStartTime(""); // Clear the start time input
      setEndTime(""); // Clear the end time input
    } catch (err) {
      toast.error("Failed to add availability: " + err.message); // Show error toast
    }
  };

  // Render the list of availabilities for the selected date
  const renderAvailabilities = () => {
    if (loading) {
      return <p>Loading availabilities...</p>;
    }

    if (availabilities.length === 0) {
      return <p>No availabilities for this date.</p>;
    }

    return (
      <ul>
        {availabilities.map((availability, index) => (
          <li key={index}>
            <strong>{availability.userName}</strong>: {availability.startTime} -{" "}
            {availability.endTime}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="calendar-page">
      <h2>Group Availabilities</h2>
      <div className="calendar-container">
        <Calendar onChange={handleDateChange} value={selectedDate} />{" "}
        {/* Calendar component */}
        <div className="selected-date">
          <h3>Selected Date: {selectedDate.toDateString()}</h3>
        </div>
      </div>

      <div className="add-availability-form">
        <h3>Add Your Availability:</h3>
        <label>Start Time: </label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <label>End Time: </label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button onClick={handleAddAvailability}>Add Availability</button>
      </div>

      <div className="availabilities">
        <h3>Availabilities on {selectedDate.toDateString()}:</h3>
        {renderAvailabilities()}
      </div>
    </div>
  );
};

export default CalendarPage;
