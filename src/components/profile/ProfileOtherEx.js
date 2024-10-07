import { useProfile } from "../context/profileContext";
import { useState } from "react";

const GroupPage = ({ groupMembers }) => {
  const { fetchUserProfile, hoveredProfile, setHoveredProfile } = useProfile(); // Access from ProfileContext
  const [loading, setLoading] = useState(false); // For showing a loader when fetching profile

  const handleMouseOver = async (userId) => {
    setLoading(true);
    const profile = await fetchUserProfile(userId); // Fetch another user's profile
    setHoveredProfile(profile); // Set the fetched profile data
    setLoading(false);
  };

  const handleMouseLeave = () => {
    setHoveredProfile(null); // Reset when mouse leaves
  };

  return (
    <div>
      <h1>Group Members</h1>
      <ul>
        {groupMembers.map((member) => (
          <li
            key={member.id}
            onMouseOver={() => handleMouseOver(member.id)}
            onMouseLeave={handleMouseLeave}
          >
            {member.name}
          </li>
        ))}
      </ul>

      {hoveredProfile && (
        <div className="hover-profile">
          {loading ? (
            <p>Loading profile...</p>
          ) : (
            <>
              <h2>{hoveredProfile.name}'s Profile</h2>
              <p>Email: {hoveredProfile.email}</p>
              {/* Add more profile details */}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupPage;
