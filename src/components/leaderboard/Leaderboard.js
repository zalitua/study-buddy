import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { db, auth } from "../../lib/firebase"; // Import Firebase auth
import { collection, query, orderBy, limit, onSnapshot, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth state listener

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Track the current user

  useEffect(() => {
    // Listen to auth changes to get the current logged-in user
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    // Query for top 10 leaderboard data
    const leaderboardQuery = query(collection(db, "users"), orderBy("points", "desc"), limit(10));

    const unsubscribeLeaderboard = onSnapshot(
      leaderboardQuery,
      (querySnapshot) => {
        const leaderboardData = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          username: doc.data().username,
          points: doc.data().points,
          rank: index + 1,
        }));
        setLeaders(leaderboardData);
      },
      (err) => {
        setError("Failed to fetch leaderboard data: " + err.message);
        setLoading(false);
      }
    );

    if (currentUser) {
      const getUserRank = async () => {
        try {
          const allUsersSnapshot = await getDocs(query(collection(db, "users"), orderBy("points", "desc")));
          const allUsers = allUsersSnapshot.docs.map((doc, index) => ({
            id: doc.id,
            username: doc.data().username,
            points: doc.data().points,
            rank: index + 1,
          }));

          const currentUserData = allUsers.find((u) => u.id === currentUser.uid);
          if (currentUserData) {
            setCurrentUserRank(currentUserData.rank);
          }
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch current user rank: " + err.message);
          setLoading(false);
        }
      };

      getUserRank();
    }

    return () => {
      unsubscribeAuth();
      unsubscribeLeaderboard();
    };
  }, [currentUser]);

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Leaderboard</h2>
      {currentUserRank && (
        <div className="mb-3">
          <h4>Your Current Rank: {currentUserRank}</h4>
        </div>
      )}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader) => (
            <tr key={leader.id}>
              <td>{leader.rank}</td>
              <td>{leader.username}</td>
              <td>{leader.points}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Leaderboard;
