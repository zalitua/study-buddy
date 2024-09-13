import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import "./group.css"
import { auth } from "../../lib/firebase";
import { db } from "../../lib/firebase";

import { useEffect } from "react";

import {
     collection, doc, getDoc,
    getDocs, query, serverTimestamp,
     updateDoc, where, addDoc,
     setDoc,
     arrayUnion,
     onSnapshot,
  } from "firebase/firestore";

import { useNavigate } from "react-router-dom";//Used for react router to get to this page



const Group = () => {

    //consts used in this file

    //used for searching and selecting users
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    //Create group
    const [groupName, setGroupName] = useState(""); //used for changing group name
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

    //edit group
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
            where('username', '>=', searchTerm),
            where('username', '<=', searchTerm + '\uf8ff')
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
      //check if group name is valid
      if (!groupName.trim()) {
          alert("Please enter a group name before creating the group.");
          return;
      }
  
      try {
          const currentUserID = auth.currentUser.uid;
          let updatedSelectedUsers = [...selectedUsers];
  
          //add the current user to the group 
          if (!selectedUsers.some((user) => user.id === currentUserID)) {
              updatedSelectedUsers.push({ id: currentUserID });
          }
  
          //remove duplicate user IDs
          const uniqueUserIDs = [...new Set(updatedSelectedUsers.map(user => user.id))];
  
          //set up group data
          const groupData = {
              groupName: groupName,
              members: uniqueUserIDs,
              createdAt: serverTimestamp(),
              createdBy: currentUserID,
          };
  
          //create the group and get the new group ID
          const groupRef = await addDoc(collection(db, 'groups'), groupData);
          const groupId = groupRef.id;
  
          //create a new chat for the group
          const chatData = {
              groupId: groupId,
              createdAt: serverTimestamp(),
              messages: [],
          };
  
          const chatRef = await addDoc(collection(db, 'chats'), chatData);
  
          //link the created chat to the group
          await updateDoc(groupRef, {
              chatId: chatRef.id,
          });
  
          //finish up
          alert("Group and chat created successfully!");
          setShowCreateGroupModal(false);
          setSelectedUsers([]);
          setGroupName("");
          fetchUserGroups();
  
      } catch (error) {
          console.log("Error creating group and chat: ", error);
      }
  };


    
    

    //Show users groups
    const fetchUserGroups = () => {
      try {
          const user = auth.currentUser;
          if (!user) {
              alert("User not logged in!!!");
              return;
          }
  
          //ref to groups
          const groupsRef = collection(db, 'groups');
          const q = query(groupsRef, where('members', 'array-contains', user.uid));
  
          //real time listener so updates every time a new one is added without refresh
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const groups = [];
              querySnapshot.forEach((doc) => {
                  groups.push({ id: doc.id, ...doc.data() });
              });
              setUserGroups(groups); //update with the real time data
          });
  
          //return the unsubscribe function to stop listening 
          return unsubscribe;
  
      } catch (error) {
          console.log("Error fetching user groups: ", error);
      }
    };
    //useEffect for the live group updating now whenever your added you update
    useEffect(() => {
      //fetch user groups only if the user is loged in
      if (auth.currentUser) {
          const unsubscribe = fetchUserGroups();
          
          //cleanup function to unsubscribe from the listener
          return () => {
              if (unsubscribe) {
                  unsubscribe();
              }
          };
      } else {
          //listen for auth state changes if the user is not authenticated 
          const unsubscribeAuth = auth.onAuthStateChanged((user) => {
              if (user) {
                  const unsubscribeGroups = fetchUserGroups();
                  
                  //cleanup listener for groups when auth state changes
                  return () => {
                      if (unsubscribeGroups) {
                          unsubscribeGroups();
                      }
                  };
              }
          });

          //cleanup function to unsubscribe from auth listener
          return () => {
              unsubscribeAuth();
          };
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


            //check linked chat is stored
            /*
            const chatId = editingGroup.chatId;
            if (chatId) {
                //ref to chat 
                const chatDocRef = doc(db, 'chats', chatId);

                //update the chat with the new members list
                await updateDoc(chatDocRef, {
                    members: uniqueUserIDs, //update chat members
                });
            }
            */    

    
            alert("Group updated successfully!");
            closeEditGroupModal();
            fetchUserGroups(); //refresh the groups list



            //make sure all users are included in the chat
            
            


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

        {/*Need to fix it showing the user who created the group*/}
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