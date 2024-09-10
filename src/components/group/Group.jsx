import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import "./group.css"
import { auth } from "../../lib/firebase";
import { db } from "../../lib/firebase";

import { useEffect } from "react";

import {
    arrayUnion, collection, doc, getDoc,
    getDocs, query, serverTimestamp,
    setDoc, updateDoc, where, addDoc,
  } from "firebase/firestore";

import { useNavigate } from "react-router-dom";//Used for react router to get to this page



const Group = () => {

    //consts used in this file
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [showEditGroupModal, setShowEditGroupModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [editGroupName, setEditGroupName] = useState("");
    const [editSelectedUsers, setEditSelectedUsers] = useState([]);
    const [userGroups, setUserGroups] = useState([]);


    //Seach users
    //to be able to search users i had to edit the fire base permessions so it would be able to sort
    
    const handleSearch = async (e) => {
        e.preventDefault();
        try {

          //get the the users from the users collection where they match the search  
          const userRef = collection(db, "users");
          const q = query(
            userRef,
            //email will be changed to user name when all users have a username
            where('email', '>=', searchTerm),
            where('email', '<=', searchTerm + '\uf8ff')
          );

          //get doc
          const querySnapShot = await getDocs(q);
          const users = [];

          //get each of the users that match the wanted data
          querySnapShot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
          });
          setSearchResults(users);
        } catch (error) {
          console.log("Error searching users: ", error);
        }
      };
      //used when the user clicks the add button so they can add a user to the group
      const handleSelectUser = (user) => {
        setSelectedUsers([...selectedUsers, user]);
      };


    //Group creation
    const handleCreateGroup = async () => {
        //check the name is valid
        if (!groupName.trim()) {
          alert("Please enter a group name before creating the group.");
          return;
        }
    
        try {
          const currentUserID = auth.currentUser.uid;
          let updatedSelectedUsers = [...selectedUsers];
          //add the current users id to the group
          if (!selectedUsers.some((user) => user.id === currentUserID)) {
            updatedSelectedUsers.push({ id: currentUserID });
          }

          //get rid of any duplicate ids
          const uniqueUserIDs = [...new Set(updatedSelectedUsers.map(user => user.id))];

          //set up the group
          const groupData = {
            groupName: groupName,
            members: uniqueUserIDs,
            createdAt: serverTimestamp(),
            createdBy: currentUserID,
          };

          //create group
          await addDoc(collection(db, 'groups'), groupData);

          //start closeing
          alert("Group created successfully!");
          setShowCreateGroupModal(false);
          setSelectedUsers([]);
          setGroupName("");
          fetchUserGroups();
        } catch (error) {
          console.log("Error creating group: ", error);
        }
      };
    

    //Show users groups
    const fetchUserGroups = async () => {
        try {
          const user = auth.currentUser;
          //check if the user is logged in
          if (!user) {
            alert("User not logged in!!!");
            return;
          }
          const groupsRef = collection(db, 'groups');
          const q = query(groupsRef, where('members', 'array-contains', user.uid));
          const querySnapshot = await getDocs(q);
          const groups = [];

          //get each group the user is in
          querySnapshot.forEach((doc) => {
            groups.push({ id: doc.id, ...doc.data() });
          });
          setUserGroups(groups);
        } catch (error) {
          console.log("Error fetching user groups: ", error);
        }
      };
      useEffect(() => {
        if (auth.currentUser) {
          fetchUserGroups();
        } else {
            //unsub if the user changes
          const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
              fetchUserGroups();
            }
          });
          return () => unsubscribe();
        }
      }, []);
    
    //modal and creating the group
    const openCreateGroupModal = () => { 
        setShowCreateGroupModal(true)
    };
    
    const closeCreateGroupModal = () => {
        //close the modal and reset all its values
        setShowCreateGroupModal(false);
        setSelectedUsers([]);
        setGroupName("");
    };

    //modal for editing a group
    const openEditGroupModal = async (group) => {
      console.log("Editing group members: ", group.members);
    
      setEditingGroup(group);
      setEditGroupName(group.groupName || "");
    
      //pass all the members id so they show up correctly
      const userDocs = await Promise.all(group.members.map(userID => getDoc(doc(db, 'users', userID))));
      const memberDetails = userDocs.map(doc => ({ id: doc.id, ...doc.data() }));
    
      setEditSelectedUsers(memberDetails); // Set the full user objects
      setShowEditGroupModal(true);
    };

    const closeEditGroupModal = () => {
        //close the modal and reset all its values
        setShowEditGroupModal(false);
        setEditingGroup(null);
        setEditGroupName("");
        setEditSelectedUsers([]);
    };


    //update information for an existing group
    const handleUpdateGroup = async () => {
        //check to see if group name is valid
        if (!editGroupName.trim()) {
        alert("Please enter a group name before updating the group.");
        return;
        }

        //try update the group
        try {
            const currentUserID = auth.currentUser.uid;

            //check the current user is part of the group
            let updatedSelectedUsers = [...editSelectedUsers];
            if (!editSelectedUsers.some((user) => user.id === currentUserID)) {
                updatedSelectedUsers.push({ id: currentUserID });
            }
    
            //filter out any invalid user objects no id
            const validUsers = updatedSelectedUsers.filter(user => user.id);
    
            //check no undefined or invalid user objects are being used
            const uniqueUserIDs = [...new Set(validUsers.map(user => user.id))];


            console.log("Unique User IDs: ", uniqueUserIDs);//ONLY RETURNING THE OWNER WHICH WAS JUST ADDED
    
            //reference the group's document in Firestore
            const docRef = doc(db, 'groups', editingGroup.id);
            
            //update the group document in Firestore
            await updateDoc(docRef, {
                groupName: editGroupName, // Update group name
                members: uniqueUserIDs,  // Update the members list
            });
    
            alert("Group updated successfully!");
            closeEditGroupModal();
            fetchUserGroups(); //refresh the groups list
        } catch (error) {
            console.log("Error updating group: ", error);
        }
    };
    
    //when add user button is clicked
    const handleAddUser = (user) => {
        setEditSelectedUsers([...editSelectedUsers, user]);
    };
    //when remove user button is clicked
    const handleRemoveUser = (user) => {
      console.log(user);
      
      // Make a copy of the current array
      const updatedUsers = [...editSelectedUsers];
      
      // Find the index of the user to be removed
      const index = updatedUsers.findIndex((u) => u.id === user.id);
      
      // If the user exists, remove them from the array
      if (index > -1) {
          updatedUsers.splice(index, 1); // Remove the user at that index
      }
      
      // Update the state with the new array
      setEditSelectedUsers(updatedUsers);
  };


    //react router code to be able to naviate around the site
    const navigate = useNavigate();
    const handleNavDash = async () => {
        //handle user going to the dash
        try {
            navigate("/");
        } catch (error) {
            console.log(error.message);
        }
    };
    const handleNavChat = () =>{
        //handle user going to chat
        try {
            navigate("/chat");
        } catch (error) {
            console.log(error.message);
        }
    };



    return(
        <div className="group">
      <div className="nav">
        <Button variant="primary" onClick={handleNavDash}>
          Dashboard
        </Button>
        <Button variant="primary" onClick={handleNavChat}>
          Chat
        </Button>
      </div>
      <div className="groups">
        <div className="create">
          <h1>Group Creation: </h1>
          <input
            type="text"
            placeholder="Search for users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <ul>
            {searchResults.map((user) => (
              <li key={user.id}>
                {user.username || user.email} {/*show either the users username or email*/}
                <button onClick={() => handleSelectUser(user)}>Add</button>
              </li>
            ))}
          </ul>
          <button onClick={openCreateGroupModal}>Create Group</button>
        </div>
    </div>
    <div className="current">
        <h1>Users Groups: </h1>
        <ul>
        {userGroups.map((group) => (
            <li key={group.id}>
            {group.groupName}
            <button onClick={() => openEditGroupModal(group)}>Edit</button>
            <button >Chat</button>
            </li>
        ))}
        </ul>
    </div>

        {/*create group modal*/}
        <Modal show={showCreateGroupModal} onHide={closeCreateGroupModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Group Name</Form.Label>
                <Form.Control
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                />
              </Form.Group>
            </Form>
            <p>Selected Users:</p>
            <ul>
              {selectedUsers.map((user) => (
                <li key={user.id}>
                  {user.username || user.email}
                  <button onClick={() => setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))}>Remove</button>
                </li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeCreateGroupModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateGroup}>
              Create Group
            </Button>
          </Modal.Footer>
        </Modal>

        {/*edit group modal*/}

        {/*TO FIX HOW IT DISPLAYS MAKE IT SO IT TAKES IN WHAT GROUP IT IS THE PERSON IS CLICKING ON*/}
        {/*RN ITS JUST MAKING IT THE EDITsELECTED USERS THIS COULD ALSO BE WHY IT BREAKS LATER*/}
        <Modal show={showEditGroupModal} onHide={closeEditGroupModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Group</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Group Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  placeholder="Enter group name"
                />
              </Form.Group>
            </Form>
            <p>Current Members:</p>
            <ul>
              {editSelectedUsers.map((user) => (
                <li key={user.id}>
                  {user.username || user.email}
                  <button onClick={() => handleRemoveUser(user)}>Remove</button>
                </li>
              ))}
            </ul>
            <p>Add Users:</p>
            <input
              type="text"
              placeholder="Search for users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <ul>
              {searchResults.map((user) => (
                <li key={user.id}>
                  {user.username || user.email}
                  <button onClick={() => handleAddUser(user)}>Add</button>
                </li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEditGroupModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateGroup}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      
    </div>
  );
};


export default Group