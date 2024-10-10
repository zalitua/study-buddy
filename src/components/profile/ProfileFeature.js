import React, { useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Link } from "react-router-dom";

import defaultProfileImage from "../../assets/default-profile.png";
import "./ProfileFeature.css";

// display a selected user's profile in a popover on hover
const ProfileFeature = ({ user }) => {
  const [showPopover, setShowPopover] = useState(false);

  // handle popover behaviour based on mouse position
  const handleMouseEnter = () => setShowPopover(true);
  const handleMouseLeave = () => setShowPopover(false);

  // popover component
  const popover = (
    <Popover
      id="user-popover"
      onMouseEnter={handleMouseEnter} // keep popover visible when hovering over
      onMouseLeave={handleMouseLeave} // hide popover when mouse leaves
    >
      {/* display user name in header */}
      <Popover.Header as="h3" className="center-content">
        {user.username || "No username"}
      </Popover.Header>
      <Popover.Body className="center-content">
        {/* display profile image */}
        <div className="image-container">
          <img
            src={user.profileImageUrl || defaultProfileImage}
            alt="profile"
            height="70px"
            width="70px"
          />
        </div>
        {/* disply first and last name */}
        {user.firstName || "No name"} {user.lastName}
        <br />
        {/* display email as a mailto link */}
        {user.email ? (
          <a href={`mailto:${user.email}`}>{user.email}</a>
        ) : (
          <>
            No email
            <br />
          </>
        )}
        {/* display gender */}
        {user.gender || "Gender not specified"}
        <br />
        {/* display pronouns */}
        {user.pronouns || "Pronouns not specified"}
        <br />
        {/* link to selected user's full profile */}
        <Link to={`/profilePage/${user.id}`}>View Profile</Link>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="right" // popover position relative to username
      show={showPopover} // change visibility based on state
      overlay={popover} // use popover as the overlay
      onToggle={(nextShow) => setShowPopover(nextShow)} // sync state with OverlayTrigger
    >
      <span
        onMouseEnter={handleMouseEnter} // show popover on hover
        onMouseLeave={handleMouseLeave} // hide popover on leave
      >
        {user.username}
      </span>
    </OverlayTrigger>
  );
};

export default ProfileFeature;
