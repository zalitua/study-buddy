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

import { useNavigate } from "react-router-dom"; //Used for react router to get to this page



const Group = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [groupName, setGroupName] = useState("");//state for group name
    const [showModal, setShowModal] = useState(false);//modal visibility state


    //Seach users
    //to be able to search users i had to edit the fire base permessions so it would be able to sort
    

    const handleSearch = async (e) => {
        e.preventDefault();
        try {

            const userRef = collection(db, "users")


            //Search for a user by email will change to user name when that is made
            //search for users compared to the search term so then all users which are greater then or = to the search show up in a list 
            const q = query(
                userRef,
                where('email', '>=', searchTerm),
                where('email', '<=', searchTerm + '\uf8ff')
            );

            const querySnapShot = await getDocs(q);
            
            
            const users = [];
            querySnapShot.forEach((doc) => {
                users.push({ id: doc.id, ...doc.data() });
            });
            
            if (users.length === 0) {
                console.log("No users found");
            } else {
                console.log("Users found: ", users);
            }
            setSearchResults(users);
        } catch (error) {
            console.log("Error searching users: ", error);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUsers([...selectedUsers, user]);
        console.log(selectedUsers);

    };


    //Group creation
    const handleCreateGroup = async () => {
        if (!groupName.trim()) {//check if groupName isn't empty
            alert("Please enter a group name before creating the group.");
            return;
        }

        try {
            const currentUserID = auth.currentUser.uid;
    
            let updatedSelectedUsers = [...selectedUsers];
    
            //if the current user is not in the selectedUsers array add
            if (!selectedUsers.some((user) => user.id === currentUserID)) {
                updatedSelectedUsers.push({ id: currentUserID });
            }
    
            //remove any duplicate user IDs by makeing it a set
            const uniqueUserIDs = [...new Set(updatedSelectedUsers.map(user => user.id))];


            console.log("Final selected users:", uniqueUserIDs);
    
            // Create group data
            const groupData = {
                groupName: groupName, //sets the group name to the one typed in the modal
                members: uniqueUserIDs, //make the users in the group to the set of ids
                createdAt: serverTimestamp(),
                createdBy: currentUserID,
            };
    
            // Add the group to the Firestore
            await addDoc(collection(db, 'groups'), groupData);
    
            alert("Group created successfully!");
            setShowModal(false);  // Close the modal after group creation
            setSelectedUsers([]); // Clear selected users after group is created
            setGroupName("");      // Reset group name input
    
        } catch (error) {
            console.log("Error creating group: ", error);
        }
    };

    //Show users groups
    const [userGroups, setUserGroups] = useState([]);

    useEffect(() => {
        const fetchUserGroups = async () => {
            try {
                // Ensure the user is authenticated before querying
                const user = auth.currentUser;
                if (!user) {
                    alert("User not loged in!!!");
                    console.log("User is not authenticated");
                    return;
                }
                // Reference to the 'groups' collection
                const groupsRef = collection(db, 'groups');
                // Query to find all groups where the current user is a member
                const q = query(groupsRef, where('members', 'array-contains', user.uid));
    
                // Execute the query
                const querySnapshot = await getDocs(q);
    
                const groups = [];
                querySnapshot.forEach((doc) => {
                    groups.push({ id: doc.id, ...doc.data() });
                });
    
                setUserGroups(groups);
            } catch (error) {
                console.log("Error fetching user groups: ", error);
            }
        };
        // Ensure that the user is authenticated and then fetch groups
        if (auth.currentUser) {
            fetchUserGroups();
        } else {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    fetchUserGroups();
                }
            });
    
            // Cleanup the subscription on unmount
            return () => unsubscribe();
        }
    }, []);
    
    //model and creating the group
    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUsers([]);//clear selected users on cancel
        setGroupName("");//clear the group name on cancel
    };

    const handleGroupNameChange = (e) => {
        setGroupName(e.target.value);
    };



    //edit an already existing group
    const [editingGroup, setEditingGroup] = useState(null); // State to store the group being edited

    const openEditGroupModal = (group) => {
        setEditingGroup(group);
        setGroupName(group.groupName); // Set the current group name in the modal
        setSelectedUsers(group.members); // Set current members in the modal
        setShowModal(true); // Open the modal
    };

    const handleUpdateGroup = async () => {
        if (!groupName.trim()) {
            alert("Please enter a group name.");
            return;
        }

        try {
            const groupRef = doc(db, 'groups', editingGroup.id);

            // Update group with new name and members
            await updateDoc(groupRef, {
                groupName: groupName,
                members: selectedUsers.map(user => user.id),
            });

            alert("Group updated successfully!");
            setShowModal(false);
            setEditingGroup(null); // Clear editing state
        } catch (error) {
            console.log("Error updating group: ", error);
        }
    };

    const handleRemoveUser = (user) => {
        setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    };
    
    const handleAddUser = (user) => {
        if (!selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
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
                    <h1>Group Creation:</h1>
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
                                {user.username}{/*some users currently don't have user names so they are blank*/}
                                <button onClick={() => handleSelectUser(user)}>Add</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={openModal}>Create Group</button>
                </div>

                <div className="current">
                    <h1>Users Groups</h1>
                    <ul>
                        {userGroups.map((group) => (
                            <>
                            <li key={group.id}>{group.groupName}</li>
                            <button onClick={() => openEditGroupModal(group)}>Edit</button>
                            </>
                        ))}
                    </ul>
                </div>

                {/* modal for group name input and to show who is being added */}
                <Modal show={showModal} onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Group Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={groupName}
                                    onChange={handleGroupNameChange}
                                    placeholder="Enter group name"
                                />
                            </Form.Group>
                        </Form>
                        <p>Users in the group:</p>
                        <ul>
                            {selectedUsers.map((user) => (
                                <li key={user.id}>
                                    {user.username} ({user.email})
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
                                    {user.username} ({user.email})
                                    <button onClick={() => handleAddUser(user)}>Add</button>
                                </li>
                            ))}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleUpdateGroup}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </div>
    );
};


export default Group