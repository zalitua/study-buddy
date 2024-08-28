import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/availabilities?date=${selectedDate.toISOString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch availabilities');
        }
        const data = await response.json();
        setAvailabilities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const renderAvailabilities = () => {
    if (loading) {
      return <p>Loading availabilities...</p>;
    }

    if (error) {
      return <p>Error fetching availabilities: {error}</p>;
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
