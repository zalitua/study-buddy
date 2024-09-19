import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { db, auth } from "../../lib/firebase"; // Import Firebase auth
import { collection, query, orderBy, limit, onSnapshot, getDocs } from "firebase/firestore";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCurrentUserRank = async () => {
    try {
      const user = auth.currentUser; // Get the currently authenticated user
      if (!user) return;

      const userId = user.uid;
      const q = query(collection(db, "users"), orderBy("points", "desc"));
      const querySnapshot = await getDocs(q);

      let currentUserRank = -1;
      let rank = 1; // Track the rank as a number starting from 1

      querySnapshot.forEach((doc) => {
        if (doc.id === userId) {
          currentUserRank = rank; // Assign the current rank to currentUserRank
          setCurrentUserData({
            id: doc.id,
            username: doc.data().username,
            points: doc.data().points,
            rank: currentUserRank, // Set the rank in the state
          });
        }
        rank++; // Increment the rank for each user
      });
    } catch (err) {
      setError("Failed to fetch current user's rank: " + err.message);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("points", "desc"), limit(10));

    // Use onSnapshot to listen to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const leaderboardData = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          username: doc.data().username,
          points: doc.data().points,
          rank: index + 1,
        }));

        setLeaders(leaderboardData);
        setLoading(false);
      },
      (err) => {
        setError("Failed to fetch leaderboard data: " + err.message);
        setLoading(false);
      }
    );

    // Fetch the current user's rank
    getCurrentUserRank();

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

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

      {currentUserData && (
        <div>
          <h3>Your Position</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr key={currentUserData.id}>
                <td>{currentUserData.rank}</td> {/* Display the correct rank */}
                <td>{currentUserData.username}</td>
                <td>{currentUserData.points}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
