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
  // sets state for selected date availabilities meetings start time end time and loading state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  
  // gets  user from authentication context
  const { user } = useUserAuth();
  
  // for navigating between pages
  const navigate = useNavigate();

  useEffect(() => {
    // checks if user is logged in, if not, warns and redirects to login page
    if (!user) {
      toast.warn("you need to be logged in to view availabilities.");
      navigate("/login");
      return;
    }

    // fetches availabilities and meetings for the selected date
    const fetchAvailabilitiesAndMeetings = async () => {
      setLoading(true);
      try {
        // fetches availabilities from database where the date matches the selected date
        const availabilitiesQuery = query(
          collection(db, "availabilities"),
          where("date", "==", selectedDate.toDateString())
        );
        const availabilitiesSnapshot = await getDocs(availabilitiesQuery);
        const availabilitiesData = availabilitiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // fetches meetings from database where the date matches the selected date
        const meetingsQuery = query(
          collection(db, "meetings"),
          where("date", "==", selectedDate.toDateString())
        );
        const meetingsSnapshot = await getDocs(meetingsQuery);
        const meetingsData = meetingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // updates state with fetched data
        setAvailabilities(availabilitiesData);
        setMeetings(meetingsData);
      } catch (err) {
        // handles errors during data fetching
        toast.error("failed to fetch data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    // calls the function to fetch availabilities and meetings
    fetchAvailabilitiesAndMeetings();
  }, [selectedDate, user, navigate]);

  // updates selected date when the user clicks on a new date in the calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // adds a new availability to the database
  const handleAddAvailability = async () => {
    if (!startTime || !endTime) {
      toast.warn("please fill in both start and end times.");
      return;
    }

    try {
      // adds availability with selected date, start time, end time, and user info
      await addDoc(collection(db, "availabilities"), {
        date: selectedDate.toDateString(),
        startTime,
        endTime,
        userId: user.uid,
        userName: user.displayName || user.email,
      });

      // shows success message and resets time fields
      toast.success("availability added successfully!");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      // handles errors during adding availability
      toast.error("failed to add availability: " + err.message);
    }
  };

  // schedules a meeting and adds it to the database
  const handleScheduleMeeting = async () => {
    if (!startTime || !endTime) {
      toast.warn("please fill in both start and end times for the meeting.");
      return;
    }

    try {
      // adds meeting with selected date, start time, end time, and user info
      await addDoc(collection(db, "meetings"), {
        date: selectedDate.toDateString(),
        startTime,
        endTime,
        userId: user.uid,
        userName: user.displayName || user.email,
      });

      // shows success message and resets time fields
      toast.success("meeting scheduled successfully!");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      // handles errors during scheduling meeting
      toast.error("failed to schedule meeting: " + err.message);
    }
  };

  // deletes a meeting from the database
  const handleDeleteMeeting = async (meetingId) => {
    try {
      // deletes the meeting by its id
      await deleteDoc(doc(db, "meetings", meetingId));
      toast.success("meeting removed successfully!");
      
      // updates state by removing the deleted meeting
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting.id !== meetingId)
      );
    } catch (err) {
      // handles errors during deletion
      toast.error("failed to remove meeting: " + err.message);
    }
  };

  // renders the list of availabilities for the selected date
  const renderAvailabilities = () => {
    if (loading) {
      return <p>loading availabilities...</p>;
    }

    if (availabilities.length === 0) {
      return <p>no availabilities for this date.</p>;
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

  // renders the list of meetings for the selected date
  const renderMeetings = () => {
    if (meetings.length === 0) {
      return <p>no meetings scheduled for this date.</p>;
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
                delete
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="calendar-page">
      <h2>availabilities and meetings</h2>
      
      {/* calendar component to choose date */}
      <div className="calendar-container">
        <Calendar onChange={handleDateChange} value={selectedDate} />
        <div className="selected-date">
          <h3>selected date: {selectedDate.toDateString()}</h3>
        </div>
      </div>

      {/* form to add availability */}
      <div className="add-availability-form">
        <h3>add your availability:</h3>
        <label>start time: </label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <label>end time: </label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button onClick={handleAddAvailability}>add availability</button>
      </div>

      {/* shows availabilities for selected date */}
      <div className="availabilities">
        <h3>availabilities on {selectedDate.toDateString()}:</h3>
        {renderAvailabilities()}
      </div>

      {/* form to schedule a meeting */}
      <div className="schedule-meeting-form">
        <h3>schedule a meeting:</h3>
        <label>start time: </label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <label>end time: </label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button onClick={handleScheduleMeeting}>schedule meeting</button>
      </div>

      {/* shows meetings for selected date */}
      <div className="meetings">
        <h3>meetings on {selectedDate.toDateString()}:</h3>
        {renderMeetings()}
      </div>
    </div>
  );
};

export default CalendarPage;
