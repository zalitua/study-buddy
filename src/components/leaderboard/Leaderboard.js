import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { db } from "../../lib/firebase"; 
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore"; // Firestore functions

const Leaderboard = ({ userId }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRank, setUserRank] = useState(null);
  const [userPoints, setUserPoints] = useState(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const q = query(
          collection(db, "users"), 
          orderBy("points", "desc"),
          limit(10) 
        );
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), 
        }));
        setLeaders(leaderboardData);

         if (userId) {
          const rankQuery = query(
            collection(db, "users"),
            orderBy("points", "desc") 
          );
          const rankSnapshot = await getDocs(rankQuery);
          const rank = rankSnapshot.docs.findIndex(
            (doc) => doc.id === userId
          );
          setUserRank(rank + 1);

          const userDoc = rankSnapshot.docs.find((doc) => doc.id === userId);
          if (userDoc) {
            setUserPoints(userDoc.data().points);
          }
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch leaderboard data: " + err.message);
        setLoading(false);
      }
    };

    fetchLeaders();
  }, [userId]);

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
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader, index) => (
            <tr key={leader.id}>
              <td>{index + 1}</td>
              <td>{leader.name}</td> 
              <td>{leader.points}</td> 
            </tr>
          ))}
          {userRank && userRank > 10 && (
            <tr>
              <td>{userRank}</td>
              <td>{leaders.find((leader) => leader.id === userId)?.name || "You"}</td>
              <td>{userPoints}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Leaderboard;
