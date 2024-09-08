import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import { db } from "../../lib/firebase"; // Ensure this path is correct
import { collection, query, orderBy, getDocs, limit, where } from "firebase/firestore";

const Leaderboard = ({ userId }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRank, setUserRank] = useState(null);
  const [userScore, setUserScore] = useState(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const q = query(
          collection(db, "leaderboard"),
          orderBy("score", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const leaderboardData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaders(leaderboardData);

        if (userId) {
          const userQuery = query(
            collection(db, "leaderboard"),
            where("id", "==", userId)
          );
          const userSnapshot = await getDocs(userQuery);
          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            setUserScore(userData.score);

            const rankQuery = query(
              collection(db, "leaderboard"),
              orderBy("score", "desc")
            );
            const rankSnapshot = await getDocs(rankQuery);
            const rank = rankSnapshot.docs.findIndex(
              (doc) => doc.id === userId
            );
            setUserRank(rank + 1); 
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
          {/* If the user is not in the top 10, show their rank separately */}
          {userRank && userRank > 10 && (
            <tr>
              <td>{userRank}</td>
              <td>{leaders.find((leader) => leader.id === userId)?.name || "You"}</td>
              <td>{userScore}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Leaderboard;
