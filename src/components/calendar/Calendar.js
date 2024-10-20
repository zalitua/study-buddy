import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useUserAuth } from "../../context/userAuthContext";
import { db } from "../../lib/firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import "./CalendarPage.css";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.warn("You need to be logged in to view availabilities.");
      navigate("/login");
      return;
    }

    const fetchAvailabilitiesAndMeetings = async () => {
      setLoading(true);
      try {
        const availabilitiesQuery = query(
          collection(db, "availabilities"),
          where("date", "==", selectedDate.toDateString())
        );
        const availabilitiesSnapshot = await getDocs(availabilitiesQuery);
        const availabilitiesData = availabilitiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const meetingsQuery = query(
          collection(db, "meetings"),
          where("date", "==", selectedDate.toDateString())
        );
        const meetingsSnapshot = await getDocs(meetingsQuery);
        const meetingsData = meetingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAvailabilities(availabilitiesData);
        setMeetings(meetingsData);
      } catch (err) {
        toast.error("Failed to fetch data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilitiesAndMeetings();
  }, [selectedDate, user, navigate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddAvailability = async () => {
    if (!startTime || !endTime) {
      toast.warn("Please fill in both start and end times.");
      return;
    }

    try {
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

  const handleScheduleMeeting = async () => {
    if (!startTime || !endTime) {
      toast.warn("Please fill in both start and end times for the meeting.");
      return;
    }

    try {
      await addDoc(collection(db, "meetings"), {
        date: selectedDate.toDateString(),
        startTime,
        endTime,
        userId: user.uid,
        userName: user.displayName || user.email,
      });

      toast.success("Meeting scheduled successfully!");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      toast.error("Failed to schedule meeting: " + err.message);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await deleteDoc(doc(db, "meetings", meetingId));
      toast.success("Meeting removed successfully!");
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting.id !== meetingId)
      );
    } catch (err) {
      toast.error("Failed to remove meeting: " + err.message);
    }
  };

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

  const renderMeetings = () => {
    if (meetings.length === 0) {
      return <p>No meetings scheduled for this date.</p>;
    }

    return (
      <ul>
        {meetings.map((meeting, index) => (
          <li key={index}>
            <strong>{meeting.userName}</strong>: {meeting.startTime} - {meeting.endTime}
            {meeting.userId === user.uid && (
              <button
                className="delete-button"
                onClick={() => handleDeleteMeeting(meeting.id)}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="calendar-page">
      <h2>Availabilities and Meetings</h2>
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

      <div className="schedule-meeting-form">
        <h3>Schedule a Meeting:</h3>
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
        <button onClick={handleScheduleMeeting}>Schedule Meeting</button>
      </div>

      <div className="meetings">
        <h3>Meetings on {selectedDate.toDateString()}:</h3>
        {renderMeetings()}
      </div>
    </div>
  );
};

export default CalendarPage;
