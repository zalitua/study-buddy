import React, { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase"; // Adjust Firebase path as needed
import { collection, query, orderBy, getDocs, limit, where, onSnapshot } from "firebase/firestore"; 
import { useUserAuth } from "../../context/userAuthContext"; // Assuming you have user context
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useUserAuth(); // Accessing the logged-in user's info
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestMessages, setLatestMessages] = useState([]); // To store latest messages from all groups
  const [topThreeUsers, setTopThreeUsers] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch upcoming events, latest messages, leaderboard data, and user groups
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch upcoming events
        const fetchUpcomingEvents = async () => {
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
        };

        // Fetch top 3 users
        const fetchTopThreeUsers = async () => {
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
        };

        // Fetch latest messages from groups
        const fetchLatestMessagesFromGroups = async () => {
          const currentUser = auth.currentUser;
          if (!currentUser) {
            console.error("User not logged in!");
            return;
          }

          const groupsRef = collection(db, "groups");
          const q = query(groupsRef, where("members", "array-contains", currentUser.uid));

          const querySnapshot = await getDocs(q);
          const latestMessagesData = [];

          querySnapshot.forEach((doc) => {
            const groupData = doc.data();
            if (groupData.latestMessage) {
              latestMessagesData.push({
                groupName: groupData.groupName,
                latestMessage: groupData.latestMessage,
              });
            }
          });

          setLatestMessages(latestMessagesData); // Display the latest message from all groups
        };

        // Fetch user groups
        const fetchUserGroups = () => {
          try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
              console.error("User not logged in!");
              return;
            }

            const groupsRef = collection(db, 'groups');
            const q = query(groupsRef, where('members', 'array-contains', currentUser.uid));

            // Real-time listener to get updated group data
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const groups = [];
              querySnapshot.forEach((doc) => {
                groups.push({ id: doc.id, ...doc.data() });
              });
              setUserGroups(groups);
            });

            // Return the unsubscribe function to stop listening when the component unmounts
            return unsubscribe;
          } catch (error) {
            console.error("Error fetching user groups:", error);
          }
        };

        // Execute the fetch functions
        await Promise.all([
          fetchUpcomingEvents(),
          fetchTopThreeUsers(),
          fetchLatestMessagesFromGroups(),
        ]);

        const unsubscribeFromGroups = fetchUserGroups();
        setLoading(false);

        // Cleanup: Unsubscribe from the group listener
        return () => {
          if (unsubscribeFromGroups) {
            unsubscribeFromGroups();
          }
        };
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
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

      {/* Latest Chat Messages from All Groups Section */}
      <section className="dashboard-section">
        <h2>Latest Messages from Your Groups</h2>
        {latestMessages.length > 0 ? (
          latestMessages.map((messageInfo, index) => (
            <div key={index}>
              <h3>{messageInfo.groupName}</h3>
              <p><strong>From:</strong> {messageInfo.latestMessage.senderName}</p>
              <p><strong>Message:</strong> {messageInfo.latestMessage.text}</p>
              {/*<p><strong>Sent At:</strong> {new Date(messageInfo.latestMessage.createdAt.toDate()).toLocaleString() || ""}</p>*/}
            </div>
          ))
        ) : (
          <p>No latest messages available.</p>
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

      {/* User Groups Section */}
      <section className="dashboard-section">
        <h2>Your Groups</h2>
        {userGroups.length > 0 ? (
          <ul>
            {userGroups.map((group) => (
              <li key={group.id}>
                <strong>Group Name:</strong> {group.groupName}<br />
                <strong>Members:</strong> {group.members.length}
              </li>
            ))}
          </ul>
        ) : (
          <p>No groups available.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
