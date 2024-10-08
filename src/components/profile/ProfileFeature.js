import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

const ProfileFeature = ({ user }) => {
  const popover = (
    <Popover id="user-popover">
      <Popover.Header as="h3">{user.username}</Popover.Header>
      <Popover.Body>
        {user.firstName} {user.lastName}
        <br />
        {user.email}
        <br />
        {user.gender}
        <br />
        {user.pronouns}
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="hover" placement="right" overlay={popover}>
      <span>{user.username}</span>
    </OverlayTrigger>
  );
};

export default ProfileFeature;
