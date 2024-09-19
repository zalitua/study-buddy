import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, where, getDocs } from "firebase/firestore";
import { useAuth } from "../../lib/auth"; // Assuming you have authentication context to get the current user

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRank, setUserRank] = useState(null); // State to store the current user's rank
  const { user } = useAuth(); // Assuming useAuth hook provides the current user's info

  useEffect(() => {
    // Query the top 10 users for leaderboard
    const q = query(collection(db, "users"), orderBy("points", "desc"), limit(10));

    // Listen for real-time updates
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

    // If the user is logged in, find their rank
    if (user) {
      const userRankQuery = query(collection(db, "users"), orderBy("points", "desc"));
      getDocs(userRankQuery).then((snapshot) => {
        let rank = 0;
        let foundUser = false;
        snapshot.forEach((doc) => {
          rank += 1;
          if (doc.id === user.uid) {
            setUserRank(rank);
            foundUser = true;
          }
        });
        if (!foundUser) {
          setError("User not found in the leaderboard.");
        }
      }).catch((err) => {
        setError("Failed to fetch user rank: " + err.message);
      });
    }

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

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
      {user && userRank && (
        <Alert variant="info">
          Your current rank: {userRank}
        </Alert>
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
