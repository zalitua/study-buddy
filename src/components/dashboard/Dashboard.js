import React, { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase"; // Adjust Firebase path as needed
import {
  collection,
  query,
  orderBy,
  getDocs,
  limit,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useUserAuth } from "../../context/userAuthContext"; // Assuming you have user context
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useUserAuth(); // Accessing the logged-in user's info
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [upcomingAvailabilities, setUpcomingAvailabilities] = useState([]); // Store group availabilities
  const [latestMessages, setLatestMessages] = useState([]); // To store latest messages from all groups
  const [topThreeUsers, setTopThreeUsers] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch upcoming events, latest messages, leaderboard data, and user groups
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const fiveDaysFromNow = new Date();
        fiveDaysFromNow.setDate(today.getDate() + 5); // Add 5 days to current date

        // Fetch tasks within the next 5 days
        const fetchUpcomingTasks = async () => {
          const tasksQuery = query(
            collection(db, "tasks"), // Assuming your tasks are stored in the 'tasks' collection
            orderBy("dueDate", "asc")
          );
          const querySnapshot = await getDocs(tasksQuery);
          const taskData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Filter tasks within the next 5 days
          const filteredTasks = taskData.filter((task) => {
            const taskDate = new Date(task.dueDate);
            return taskDate >= today && taskDate <= fiveDaysFromNow;
          });

          setUpcomingTasks(filteredTasks);
        };

        // Fetch group availabilities within the next 5 days
        const fetchUpcomingAvailabilities = async () => {
          const availabilitiesQuery = query(
            collection(db, "availabilities"), // Assuming your calendar events are in 'availabilities' collection
            orderBy("date", "asc")
          );
          const querySnapshot = await getDocs(availabilitiesQuery);
          const availabilityData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Filter availabilities within the next 5 days
          const filteredAvailabilities = availabilityData.filter(
            (availability) => {
              const availabilityDate = new Date(availability.date);
              return (
                availabilityDate >= today && availabilityDate <= fiveDaysFromNow
              );
            }
          );

          setUpcomingAvailabilities(filteredAvailabilities);
        };

        // Fetch top 3 users from leaderboard
        const fetchTopThreeUsers = async () => {
          const leaderboardQuery = query(
            collection(db, "users"), // Access the 'users' collection
            orderBy("points", "desc"), // Order by top-level 'points'
            limit(3) // Get the top 3 users
          );
          const querySnapshot = await getDocs(leaderboardQuery);

          if (!querySnapshot.empty) {
            const leaderboardData = querySnapshot.docs.map((doc, index) => ({
              id: doc.id,
              rank: index + 1, // Rank based on order in the query
              username: doc.data().username, // Access 'username' from the document
              points: doc.data().points, // Access 'points' from the document
            }));

            setTopThreeUsers(leaderboardData);
          }
        };

        // Fetch latest messages from groups
        const fetchLatestMessagesFromGroups = async () => {
          const currentUser = auth.currentUser;
          if (!currentUser) {
            console.error("User not logged in!");
            return;
          }

          const groupsRef = collection(db, "groups");
          const q = query(
            groupsRef,
            where("members", "array-contains", currentUser.uid)
          );

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

          setLatestMessages(latestMessagesData);
        };

        // Fetch user groups
        const fetchUserGroups = () => {
          try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
              console.error("User not logged in!");
              return;
            }

            const groupsRef = collection(db, "groups");
            const q = query(
              groupsRef,
              where("members", "array-contains", currentUser.uid)
            );

            // Real-time listener to get updated group data
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const groups = [];
              querySnapshot.forEach((doc) => {
                groups.push({ id: doc.id, ...doc.data() });
              });
              setUserGroups(groups);
            });

            return unsubscribe;
          } catch (error) {
            console.error("Error fetching user groups:", error);
          }
        };

        // Execute the fetch functions
        await Promise.all([
          fetchUpcomingTasks(),
          fetchUpcomingAvailabilities(),
          fetchTopThreeUsers(),
          fetchLatestMessagesFromGroups(),
        ]);

        const unsubscribeFromGroups = fetchUserGroups();
        setLoading(false);

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
      <h2 className="dashTitle">Dashboard Overview</h2>

      <span className="dashBlurb">
        Welcome to the Study Buddy dashboard here you can see a quick version of
        everything currently going on on the site. The dashboard shows the
        latest messages for any group you're in, the upcoming tasks for the next 5
        days, the group availabilities for the next 5 days, and the top 3 users
        currently on the leaderboard. Happy Studying and good luck with your
        goals!!!
      </span>

      {/* Two-column layout */}
      <div className="dashboardTop">
        {/* Upcoming Tasks Section */}
        <div className="dashboardTasks">
          <h3>Upcoming Tasks in the Next 5 Days</h3>
          {upcomingTasks.length > 0 ? (
            <ul>
              {upcomingTasks.map((task) => (
                <li key={task.id}>
                  <strong>Task Title:</strong>
                  {task.task}
                  <br />
                  <strong>Due Date:</strong>{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toDateString()
                    : "Date not available"}
                  <br />
                  {/*<strong>Task Details:</strong> {task.details} WE DON'T HAVE DETAILS FOR TASKS RIGHT NOW*/}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks in the next 5 days.</p>
          )}
        </div>

        {/* Upcoming Group Availabilities Section */}
        <div className="dashboardAvailabilities">
          <h3>Group Availabilities in the Next 5 Days</h3>
          {upcomingAvailabilities.length > 0 ? (
            <ul>
              {upcomingAvailabilities.map((availability) => (
                <li key={availability.id}>
                  <strong>Group Member:</strong> {availability.userName}
                  <br />
                  <strong>Date:</strong>{" "}
                  {new Date(availability.date).toDateString()}
                  <br />
                  <strong>Start Time:</strong> {availability.startTime}
                  <br />
                  <strong>End Time:</strong> {availability.endTime}
                </li>
              ))}
            </ul>
          ) : (
            <p>No availabilities in the next 5 days.</p>
          )}
        </div>
      </div>

      {/* Latest Chat Messages from All Groups Section */}
      <div className="dashboardBottom">
        <div className="dashboardLatestMessages">
          <h3>Latest Messages from Your Groups</h3>
          {latestMessages.length > 0 ? (
            latestMessages.map((messageInfo, index) => (
              <div className="dashboardMessage" key={index}>
                <h3>{messageInfo.groupName}</h3>
                <p>
                  <strong>From:</strong> {messageInfo.latestMessage.senderName}
                </p>
                <p>
                  <strong>Message:</strong> {messageInfo.latestMessage.text}
                </p>
                <p>
                  <strong>Sent At:</strong>
                  {messageInfo.latestMessage.createdAt
                    ? typeof messageInfo.latestMessage.createdAt.toDate ===
                      "function"
                      ? new Date(
                          messageInfo.latestMessage.createdAt.toDate()
                        ).toLocaleString()
                      : new Date(
                          messageInfo.latestMessage.createdAt
                        ).toLocaleString()
                    : "Date not available"}
                </p>
              </div>
            ))
          ) : (
            <p>No latest messages available.</p>
          )}
        </div>

        {/* Top 3 Users from Leaderboard */}
        <div className="dashboardLeaderboard">
          <h3>Top 3 Users on the Leaderboard</h3>
          {topThreeUsers.length > 0 ? (
            <ul>
              {topThreeUsers.map((user) => (
                <li key={user.id}>
                  <strong>Rank:</strong> {user.rank}
                  <br />
                  <strong>Username:</strong> {user.username}
                  <br />
                  <strong>Points:</strong> {user.points}
                </li>
              ))}
            </ul>
          ) : (
            <p>No leaderboard data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
