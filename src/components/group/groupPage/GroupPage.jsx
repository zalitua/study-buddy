//Group page
//used as the home page for each group
//has info like the people in the group
//members main page for the group

import React, { useState, useEffect } from "react";
import "./groupPage.css";
import { Button, Modal, Form } from "react-bootstrap";

import { toast } from "react-toastify";

import { useNavigate, useParams } from "react-router-dom";
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import ProfileFeature from "../../profile/profilefeature/ProfileFeature";

const GroupPage = () => {
  const { groupId } = useParams();

  //group info
  const [group, setGroup] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]); //only does the ids right now
  const [chatId, setChatId] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [latestMessage, setlatestMessage] = useState([]);

  //users info
  const [users, setUsers] = useState([]);

  //edit group
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const fetchGroup = async () => {
    //get and set all the groups data
    try {
      //ref to groups
      const docRef = doc(db, "groups", groupId);
      const groupDocSnap = await getDoc(docRef);
      if (groupDocSnap.exists()) {
        const groupData = groupDocSnap.data();

        setGroup(groupData);
        setGroupName(groupData.groupName); //set the group name
        setMembers(groupData.members || []); //set members in the group
        setChatId(groupData.chatId);

        setCreatedBy(groupData.createdBy);

        getLatestMessageInfo(groupData.latestMessage);
      } else {
        console.log("Group does not exist");
      }
    } catch (error) {
      console.log("Error fetching group: ", error);
    }
  };

  const getLatestMessageInfo = (latestMessage) => {
    //get the latest message from the group info
    if (latestMessage) {
      const latestMessageData = {
        senderName: latestMessage.senderName || "Unknown Sender",
        message: latestMessage.text || "No message content",
        createdAt: latestMessage.createdAt || null,
      };
      setlatestMessage(latestMessageData);
    } else {
      setlatestMessage(null);
    }
  };

  //fetch the users data
  //used for the User profile hover
  const fetchUsersInGroup = async () => {
    try {
      let userList = [];
      for (let memberId of members) {
        const docRef = doc(db, "users", memberId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          userList.push({
            id: docSnap.id,
            ...docSnap.data(),
          });
        }
      }
      setUsers(userList);
    } catch (error) {
      console.log("Error fetching users: ", error);
    }
  };

  //handle Edit Group modal toggle
  const handleShowEditGroupModal = () => setShowEditGroupModal(true);
  const handleCloseEditGroupModal = () => setShowEditGroupModal(false);

  const handleGroupNameChange = (e) => {
    setNewGroupName(e.target.value);
  };

  //update group data
  const handleSaveGroupChanges = async () => {
    if (newGroupName === "") {
      toast.warn("Group name can not be empty");
      return;
    }
    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        groupName: newGroupName,
      });
      setGroupName(newGroupName);
      handleCloseEditGroupModal();
    } catch (error) {
      console.log("Error updating group: ", error);
    }
  };

  //leave the group
  //can't leave the group if you are the owner
  const handleLeaveGroup = async () => {
    //stop group owner from leaving
    if (createdBy === auth.currentUser.uid) {
      toast.warn("You are the owner of the group and cannot leave.");
      return;
    }
    try {
      const groupRef = doc(db, "groups", groupId);
      //remove current user from members
      await updateDoc(groupRef, {
        members: arrayRemove(auth.currentUser.uid),
      });
      //go back to the groups page
      navigate("/group");
    } catch (error) {
      console.log("Error leaving group: ", error);
    }
  };

  //remove a user from the group
  const handleRemoveMember = async (userId) => {
    try {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        members: arrayRemove(userId),
      });
      setMembers(members.filter((member) => member !== userId));
    } catch (error) {
      console.log("Error removing member: ", error);
    }
  };

  //group use effect
  //run each time the group id changes
  useEffect(() => {
    fetchGroup();
  }, []);

  //users use effect
  //run each time the members list changes
  useEffect(() => {
    if (members.length > 0) {
      fetchUsersInGroup();
    }
  }, [members]);

  const navigate = useNavigate();
  const handleNavChat = (groupId, chatId) => {
    //handle user going to chat
    //group and chat are passed to make sure the context is kept eaiser

    try {
      if (!chatId) {
        alert("Chat not found for this group.");
        return;
      } else {
        navigate(`/chat/${groupId}/${chatId}`); //navigate to each unique chat
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNavGroup = async () => {
    //handle user going to the group
    try {
      navigate("/group");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="groupPage">
      <div className="nav">
        <Button variant="primary" onClick={handleNavGroup}>
          Back to Groups
        </Button>
      </div>

      <h1 className="groupName">{groupName || "No group name"}</h1>

      <div className="groupButtons">
        {createdBy === auth.currentUser.uid ? (
          <Button onClick={handleShowEditGroupModal}>Edit</Button>
        ) : (
          <Button disabled={true} variant="disabled">
            Edit
          </Button>
        )}
        <Button onClick={() => handleNavChat(groupId, chatId)}>Chat</Button>
        <Button onClick={handleLeaveGroup}>Leave Group</Button>
      </div>

      <h2>Members</h2>
      <div className="members">
        <ul>
          {members.length > 0 ? (
            users.map((user) => (
              <li key={user.id}>
                <ProfileFeature user={user} />{" "}
                {/*Could also include their role in sprint 3*/}
              </li>
            ))
          ) : (
            <li>No members in this group.</li>
          )}
        </ul>
      </div>

      <div className="latestMessage">
        <h2>Latest message</h2>
        {latestMessage ? (
          <div className="messageItem">
            <p>
              <strong>{latestMessage.senderName || "Unknown Sender"}:</strong>{" "}
              {latestMessage.message || "No message content"}
            </p>
            <p className="messageTimestamp">
              Sent at:{" "}
              {latestMessage.createdAt
                ? new Date(latestMessage.createdAt.toDate()).toLocaleString()
                : "No timestamp"}
            </p>
          </div>
        ) : (
          <p>No latest messages available.</p>
        )}
      </div>

      {/* Edit Group Modal */}
      <Modal show={showEditGroupModal} onHide={handleCloseEditGroupModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGroupName">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                value={newGroupName}
                onChange={handleGroupNameChange}
                placeholder="Enter new group name"
              />
            </Form.Group>
            <Form.Group controlId="formGroupMembers">
              <Form.Label>Group Members</Form.Label>
              <ul>
                {members.length > 0 ? (
                  users.map((user) => (
                    <li key={user.id}>
                      <span>
                        <ProfileFeature user={user} />
                      </span>
                      {user.id !== createdBy && ( //can't remove the owner
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveMember(user.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </li>
                  ))
                ) : (
                  <li>No members in this group.</li>
                )}
              </ul>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditGroupModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveGroupChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GroupPage;
