//file which stores the majority of the chat functions
import { Button } from "react-bootstrap";

import './chat.css'
import { auth } from "../../lib/firebase";
import { db } from "../../lib/firebase";

import React, { useEffect, useState } from 'react'

import EmojiPicker from "emoji-picker-react";


import { useParams } from "react-router-dom";


//firebase database imports
import { 
     addDoc, collection, deleteDoc, doc,
     getDoc,
     getDocs, onSnapshot, orderBy, 
     query, updateDoc } 
    from 'firebase/firestore'

import { useNavigate } from "react-router-dom"; //used for react router to get to this page



const Chat = () =>{

    const {groupId,  chatId} = useParams(); // Extracts groupId and chatId from the URL

    const [show, setShow] = useState(false); //check to make sure the user is in thr group


    const [chat, setChat] = useState();

    // used for testing the passing of the IDs
    //console.log("chatId from chat: " + chatId);
    //console.log("groupId from chat: " + groupId);


    const [msg, setMsg] = useState('');
    const [user, setUser] = useState('');
    const [data, setData] = useState([]);


    const [groupName, setGroupName] = useState('');

    const [members, setMembers] = useState([]);

    const fetchGroupData = async () => {
        try {
            const docRef = doc(db, "groups", groupId);
            const groupDocSnap = await getDoc(docRef);
            if (groupDocSnap.exists()) {
                //console.log(groupDocSnap.data())
                const groupData = groupDocSnap.data();
                //console.log(groupData);
                
                setGroupName(groupData.groupName); //set the group name here
                //console.log(groupName);

                //groupData.members.forEach((member)=>setMembers());
                setMembers(groupData.members || []); //set members in the group
                //console.log(members);


            } else {
                console.log("Group does not exist");
            }
        } catch (error) {
            console.log("Error fetching group data:", error);
        }
    };

    const fetchChat = async () =>{
        try{
            const docRef = doc(db, "chats", chatId);
            const chatDocSnap = await getDoc(docRef);
            if (chatDocSnap.exists()) {
                //console.log(groupDocSnap.data())
                const chatData = chatDocSnap.data();
                console.log( chatData);


                setChat(chatData);
                console.log(chat);
                
                //setGroupName(chatData.); //set the group name here
                //console.log(groupName);

                //groupData.members.forEach((member)=>setMembers());
                //setMembers(groupData.members || []); //set members in the group
                //console.log(members);


            } else {
                console.log("Group does not exist");
            }
        }
        catch (error) {
            console.log("Error fetching chat data:", error);
        }
    };


    //get all the messages from the chat
    const fetchMessages = async () => {

    };



    //handle sending a message to the chat
    const handleSend = async () => {

        const ref = collection(db, )

        await addDoc

    };

    //be able to edit a message you sent
    const handleEdit = async () => {

    };

    //be able to delete a message you sent
    const handleDelete = async () =>{

    };




    //to get the groups data
    //runs everytime the group id changes
    useEffect(() => {

        fetchGroupData();
        fetchChat();

        //console.log("Current chat from chat" + chat);

        // Check the auth state of the user
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);  // Set the logged-in user
            } else {
                setShow(false); // No user is logged in
            }
        });

        return () => unsubscribe();  // Cleanup the auth listener

    }, [groupId]);
    
    //used to check if the user is in the group
    //if in the group allow them to message
    //if not tell them page not found return to the main page
    //runs each time the memebers list changes or the user changes
    useEffect(() => {
        if (user && members.length > 0) {
            if (members.includes(user.uid)) {
                //console.log("You are in the group");
                //console.log(members);
                setShow(true); //show the chat if user in group
            } else {
                //console.log("You are NOT in the group");
                //console.log(members);
                setShow(false); //hide the chat if user not in group
            }
        }
    }, [members, user]);  // Re-run this effect whenever `members` or `user` changes





    
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
    const handleNavGroup = async () => {
        //handle user going to the group
        try {
            navigate("/group");
        } catch (error) {
            console.log(error.message);
        }
    };



    return(
        <div className="chat">
            <div className="nav">

                <Button variant="primary" onClick={handleNavDash}>
                    Dashboard
                </Button>

                <Button variant="primary" onClick={handleNavGroup}>
                    Groups
                </Button>
                
            </div>


            {/*check to see if the user is in the group */
             show?   
                //user is in the group
                <div className="inGroup">
                    <h2>Chat for: {groupName}</h2>

                    {chat?.messsages?.map(message=>(
                        <div className='message' key={message?.createAt}>
                            <h1>Sender</h1>
                            <p>{message.text}</p>
                            <span>{/*message.createAt*/}</span>
                        </div>
                        ))
                    }
                    <div className='sender'>
                        <input  />
                        <div className="emoji">
                            <img
                                src="./emoji.png"
                                alt=""
                                
                            />
                            <div className="picker">
                                
                            </div>
                        </div>
                        <button >send</button>
                    </div>
                </div>:
                //the user isn't in the group
                <div className="notInGroup">
                    <h2>You are not a member of this group.</h2>
                </div>
            }
        </div>
    );
    
};


export default Chat; //exports the chat function to main