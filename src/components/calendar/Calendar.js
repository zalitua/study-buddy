import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useUserAuth } from "../../context/UserAuthContext";
import { db } from "../../lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "./CalendarPage.css";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (!user) {
      toast.warn("You need to be logged in to view availabilities.");
      navigate("/login");
      return;
    }

    const fetchAvailabilities = async () => {
      setLoading(true);
      try {
        // Query to fetch availabilities for the selected date
        const q = query(
          collection(db, "availabilities"),
          where("date", "==", selectedDate.toDateString())
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => doc.data());
        setAvailabilities(data);
      } catch (err) {
        toast.error("Failed to fetch availabilities: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, [selectedDate, user, navigate]);

  // Update the selected date when a new one is chosen
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddAvailability = async () => {
    // Check if both start and end times are filled in
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
        userName: user.displayName || user.email,
      });

      toast.success("Availability added successfully!");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      toast.error("Failed to add availability: " + err.message);
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
        <Calendar onChange={handleDateChange} value={selectedDate} />
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
