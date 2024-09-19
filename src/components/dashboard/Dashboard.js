import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase"; // Adjust Firebase path as needed
import { collection, query, orderBy, getDocs, doc, getDoc, limit } from "firebase/firestore"; // Added 'limit'
import { useUserAuth } from "../../context/userAuthContext"; // Assuming you have user context
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useUserAuth(); // Accessing the logged-in user's info
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestMessage, setLatestMessage] = useState(null);
  const [topThreeUsers, setTopThreeUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch upcoming events, latest message, and leaderboard data
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const today = new Date();
        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const eventsQuery = query(
          collection(db, "events"),
          orderBy("date", "asc") // Order events by date
        );
        const querySnapshot = await getDocs(eventsQuery);
        const eventData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredEvents = eventData.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate <= thirtyDaysFromNow;
        });

        setUpcomingEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    const fetchLatestMessage = async () => {
      try {
        const groupDoc = doc(db, "groups", "groupId"); // Replace 'groupId' with actual group ID
        const groupSnapshot = await getDoc(groupDoc);
        if (groupSnapshot.exists()) {
          const groupData = groupSnapshot.data();
          setLatestMessage(groupData.latestMessage); // Assuming 'latestMessage' exists in the group document
        }
      } catch (error) {
        console.error("Error fetching latest message:", error);
      }
    };

    const fetchTopThreeUsers = async () => {
      try {
        const leaderboardQuery = query(
          collection(db, "leaderboard"),
          orderBy("score", "desc"),
          limit(3) // Get the top 3 users
        );
        const querySnapshot = await getDocs(leaderboardQuery);
        const leaderboardData = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          rank: index + 1,
          ...doc.data(),
        }));

        setTopThreeUsers(leaderboardData);
      } catch (error) {
        console.error("Error fetching top 3 users from the leaderboard:", error);
      }
    };

    setLoading(true);
    fetchUpcomingEvents();
    fetchLatestMessage();
    fetchTopThreeUsers();
    setLoading(false);
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard Overview</h1>

      {/* Upcoming Events Section */}
      <section className="dashboard-section">
        <h2>Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <ul>
            {upcomingEvents.map((event) => (
              <li key={event.id}>
                <strong>Event Title:</strong> {event.title}<br />
                <strong>Event Date:</strong> {new Date(event.date).toDateString()}<br />
                <strong>Event Time:</strong> {event.time}<br />
                <strong>Event Location:</strong> {event.location}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming events.</p>
        )}
      </section>

      {/* Latest Chat Message Section */}
      <section className="dashboard-section">
        <h2>Latest Message</h2>
        {latestMessage ? (
          <div>
            <strong>From:</strong> {latestMessage.senderName}<br />
            <strong>Message:</strong> {latestMessage.text}<br />
            <strong>Sent At:</strong> {new Date(latestMessage.createdAt.toDate()).toLocaleString()}
          </div>
        ) : (
          <p>No messages available.</p>
        )}
      </section>

      {/* Top 3 Users from Leaderboard */}
      <section className="dashboard-section">
        <h2>Top 3 Users on the Leaderboard</h2>
        {topThreeUsers.length > 0 ? (
          <ul>
            {topThreeUsers.map((user) => (
              <li key={user.id}>
                <strong>Rank:</strong> {user.rank}<br />
                <strong>Username:</strong> {user.username}<br />
                <strong>Points:</strong> {user.points}
              </li>
            ))}
          </ul>
        ) : (
          <p>No leaderboard data available.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
