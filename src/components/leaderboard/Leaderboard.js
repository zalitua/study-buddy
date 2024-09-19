import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("points", "desc"), limit(10));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leaderboardData = [];
      querySnapshot.forEach((doc, index) => {
        leaderboardData.push({
          id: doc.id,
          username: doc.data().username,
          points: doc.data().points,
          rank: index + 1,
        });
      });

      setLeaders(leaderboardData);
      setLoading(false);
    }, (err) => {
      setError("Failed to fetch leaderboard data: " + err.message);
      setLoading(false);
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
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
    </div>
  );
};

export default Leaderboard;
