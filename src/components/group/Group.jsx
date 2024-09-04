import { Button } from "react-bootstrap";
import { useState } from "react";
import "./group.css"
import { auth } from "../../lib/firebase";
import { db } from "../../lib/firebase";

import { useEffect } from "react";


import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
    addDoc,
  } from "firebase/firestore";

import { useNavigate } from "react-router-dom"; //Used for react router to get to this page



const Group = () => {

    //Seach users
    //to be able to search users i had to edit the fire base permessions so it would be able to sort
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

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
        try {
            const groupData = {
                groupName: "Group Name Here", //NEED TO HANDLE AN INPUT FOR A GROUP NAME
                members: selectedUsers.map((user) => user.id),
                createdAt: serverTimestamp(),
                createdBy: auth.currentUser.uid,
            };
    
            await addDoc(collection(db, 'groups'), groupData);
            alert("Group created successfully!");
        } catch (error) {
            console.log("Error creating group: ", error);
        }
    };

    //Show users groups


    //need to fix this shit


    const [userGroups, setUserGroups] = useState([]);

    useEffect(() => {
        const fetchUserGroups = async () => {
            try {
                // Reference to the 'groups' collection
                const groupsRef = collection(db, 'groups');
    
                // Query to find all groups where the current user is a member
                const q = query(groupsRef, where('members', 'array-contains', auth.currentUser.uid));
    
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
    
        fetchUserGroups();
    }, []);
    


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
                    <button onClick={handleCreateGroup}>Create Group</button>
                </div>

                <div className="current">
                    <h1>Current Groups</h1>
                    <ul>
                        {userGroups.map((group) => (
                            <li key={group.id}>{group.groupName}</li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};


export default Group