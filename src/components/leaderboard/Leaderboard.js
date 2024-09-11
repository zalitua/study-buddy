import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const Leaderboard = ({ userId }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRank, setUserRank] = useState(null);
  const [userPoints, setUserPoints] = useState(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const rankQuery = query(collection(db, "users"), orderBy("points", "desc"));
        const rankSnapshot = await getDocs(rankQuery);

        const allUsersData = rankSnapshot.docs.map((doc, index) => ({
          id: doc.id,
          username: doc.data().username,
          points: doc.data().points,
          rank: index + 1, 
        }));

        const topLeaders = allUsersData.slice(0, 10);
        setLeaders(topLeaders);

         if (userId) {
          const userDoc = allUsersData.find((user) => user.id === userId);
          if (userDoc) {
            setUserRank(userDoc.rank); 
            setUserPoints(userDoc.points);
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
          {userRank && userRank > 10 && (
            <tr>
              <td>{userRank}</td>
              <td>{leaders.find((leader) => leader.id === userId)?.username || "You"}</td>
              <td>{userPoints}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Leaderboard;
