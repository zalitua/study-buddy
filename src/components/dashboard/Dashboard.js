import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase"; // Adjust Firebase path as needed
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { useUserAuth } from "../../context/userAuthContext"; // Assuming you have user context
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useUserAuth(); // Accessing the logged-in user's info
  const [userRank, setUserRank] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilePicture] = useState(""); // Removed setProfilePicture

  // Fetch leaderboard and find user's rank
  useEffect(() => {
    const fetchUserRank = async () => {
      try {
        const q = query(collection(db, "leaderboard"), orderBy("score", "desc"));
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const rank = leaderboardData.findIndex((leader) => leader.id === user.uid) + 1;
        setUserRank(rank);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    const fetchUpcomingEvents = async () => {
      try {
        const today = new Date();
        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const eventsQuery = query(
          collection(db, "events"),
          orderBy("date", "asc")
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

    setLoading(true);
    fetchUserRank();
    fetchUpcomingEvents();
    setLoading(false);
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleNavGroup = async () => {
    try {
        navigate("/group");
    } catch (error) {
        console.log(error.message);
    }
};

  return (
    <div className="dashboard-container">
      {/* Profile Picture in Corner */}
      <div className="profile-picture-frame">
        <img
          src={profilePicture || "https://via.placeholder.com/50"} // Placeholder if no profile picture is available
          alt="Profile"
          className="profile-picture"
        />
      </div>

      <h1>Dashboard Overview</h1>

      {/* User's Rank Section */}
      <section className="dashboard-section">
        <h2>Your Rank</h2>
        {userRank ? (
          <p>
            You are currently ranked <strong>{userRank}</strong> on the
            leaderboard!
          </p>
        ) : (
          <p>Your rank is not available.</p>
        )}
      </section>

      {/* Upcoming Events Section */}
      <section className="dashboard-section">
        <h2>Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <ul>
            {upcomingEvents.map((event) => (
              <li key={event.id}>
                <strong>{event.title}</strong> - {new Date(event.date).toDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming events.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
