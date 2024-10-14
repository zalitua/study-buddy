//Group page
//used as the home page for each group
//has info like the people in the group 

//members main page for the group

import React, { useState, useEffect } from "react";
import "./groupPage.css";
import { Button, Modal, Form } from "react-bootstrap";


import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import ProfileFeature from "../../profile/ProfileFeature";


//import {ProfileFeature} from "../../../context/ProfileFeature";



const GroupPage = () => {

    const {groupId} = useParams();

    //group info
    const [group, setGroup] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [members, setMembers] = useState([]);//only does the ids right now
    const [chatId, setChatId] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [latestMessage, setlatestMessage] = useState([]);

    //users info
    const [users, setUsers] = useState([]);


    //edit group
    const [showEditGroupModal, setShowEditGroupModal] = useState(false);

    const fetchGroup = async () =>{
        //get and set all the groups data

        try {
            //ref to groups
            const docRef = doc(db, "groups", groupId);
            const groupDocSnap = await getDoc(docRef);
            if (groupDocSnap.exists()) {
                
                const groupData = groupDocSnap.data();

                setGroup(groupData);
                setGroupName(groupData.groupName);//set the group name
                setMembers(groupData.members || []);//set members in the group
                setChatId(groupData.chatId);

                setCreatedBy(groupData.createdBy);

                //setlatestMessage(groupData.latestMessage || null);
                getLatestMessageInfo(groupData.latestMessage);

               
            } else {
                console.log("Group does not exist");
            }

      
          } catch (error) {
            console.log("Error fetching group: ", error);
          }

    }

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
            const docRef = doc(db, 'users', memberId);
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

    }


    const editGroup =async () => {
   

    }



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


    //get latest messages
    

    const navigate = useNavigate();
    const handleNavChat = ( groupId, chatId) => {
        //handle user going to chat
        //group and chat are passed to make sure the context is kept eaiser
    
        try {
    
          if (!chatId) {
            alert("Chat not found for this group.");
            return;
          }
          else {
            navigate(`/chat/${groupId}/${chatId}`);//navigate to each unique chat
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

            <h1 className="groupName">{groupName || "No group name" }</h1>

            
            <div className="groupButtons">
                {createdBy === auth.currentUser.uid? (
                    <Button >Edit</Button>
                  ) : 
                    <Button disabled={true} variant="disabled">Edit</Button>
                }
                <Button onClick={() => handleNavChat(groupId, chatId)}>Chat</Button>
                <Button >Leave Group</Button>
            </div>

            <div className="members">
                <h2>Members</h2>
            
                <ul>
                    {members.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id}>
                            <ProfileFeature user={user} /> {/*Could also include their role in sprint 3*/}
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
                        <p><strong>{latestMessage.senderName || "Unknown Sender"}:</strong> {latestMessage.message || "No message content"}</p>
                        <p className="messageTimestamp">
                            {latestMessage.createdAt ? new Date(latestMessage.createdAt.toDate()).toLocaleString() : "No timestamp"}
                        </p>
                    </div>
                ) : (
                    <p>No latest messages available.</p>
                )}
            </div>



        </div>



        
    );
};

export default GroupPage;
