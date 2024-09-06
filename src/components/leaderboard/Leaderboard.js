import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { db } from "../../lib/firebase"; // Adjust the path as necessary
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const q = query(
          collection(db, "leaderboard"),
          orderBy("score", "desc")
        );
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaders(leaderboardData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch leaderboard data: " + err.message);
        setLoading(false);
      }
    };

    fetchLeaders();
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
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader, index) => (
            <tr key={leader.id}>
              <td>{index + 1}</td>
              <td>{leader.name}</td>
              <td>{leader.score}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Leaderboard;
