import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useUserAuth } from "../../context/userAuthContext";
import { fetchAvailabilitiesForDate } from "../../services/availabilityService"; // Assume this is a service that handles API requests

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.warn("You need to be logged in to view availabilities.");
      navigate("/login");
      return;
    }

    const fetchAvailabilities = async () => {
      setLoading(true);
      try {
        const data = await fetchAvailabilitiesForDate(selectedDate);
        setAvailabilities(data);
      } catch (err) {
        toast.error("Failed to fetch availabilities: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, [selectedDate, user, navigate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
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
        {availabilities.map((member) => (
          <li key={member.id}>
            {member.name}: {member.time}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="calendar-page">
      <h2>Group Availabilities</h2>
      <Calendar onChange={handleDateChange} value={selectedDate} />
      <div className="availabilities">
        <h3>Availabilities on {selectedDate.toDateString()}:</h3>
        {renderAvailabilities()}
      </div>
    </div>
  );
};

export default CalendarPage;

