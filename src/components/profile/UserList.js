import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase"; // Firebase setup
import { collection, getDocs, query, limit } from "firebase/firestore";
import ProfileFeature from "./ProfileFeature"; // Import your popover profile component

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), limit(4));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <ProfileFeature user={user} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
