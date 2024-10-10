import React, { useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Link } from "react-router-dom";
import defaultProfileImage from "../../assets/default-profile.png";
import "./ProfileFeature.css";

const ProfileFeature = ({ user }) => {
  const [showPopover, setShowPopover] = useState(false);

  const handleMouseEnter = () => setShowPopover(true);
  const handleMouseLeave = () => setShowPopover(false);

  const popover = (
    <Popover
      id="user-popover"
      onMouseEnter={handleMouseEnter} // keep popover visible when hovering over
      onMouseLeave={handleMouseLeave} // hide popover when mouse leaves
    >
      <Popover.Header as="h3" className="center-content">
        {user.username || "No username"}
      </Popover.Header>
      <Popover.Body className="center-content">
        <div className="image-container">
          <img
            src={user.profileImageUrl || defaultProfileImage}
            alt="profile image"
            height="70px"
            width="70px"
          />
        </div>
        {user.firstName || "No name"} {user.lastName}
        <br />
        {user.email || "No email"}
        <br />
        {user.gender || "No gender provided"}
        <br />
        {user.pronouns || "No pronouns provided"}
        <br />
        <Link to={`/profilePage/${user.id}`}>View Profile</Link>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="right"
      show={showPopover} // change visibility based on state
      overlay={popover}
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
