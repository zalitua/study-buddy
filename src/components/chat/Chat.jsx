//file which stores the majority of the chat functions
import { Button } from "react-bootstrap";

import './chat.css'
import { auth } from "../../lib/firebase";
import { db } from "../../lib/firebase";

import React, { useEffect, useRef, useState } from 'react'

//import EmojiPicker from "emoji-picker-react"; used in second sprint


import { useParams } from "react-router-dom";


//firebase database imports
import { 
     addDoc, collection,  doc,
     getDoc, serverTimestamp,
     onSnapshot, orderBy, 
     query, updateDoc} 
    from 'firebase/firestore'

import { useNavigate } from "react-router-dom"; //used for react router to get to this page



const Chat = () =>{

    const {groupId,  chatId} = useParams(); //get group and chat ids

    const [show, setShow] = useState(false); //check to make sure the user is in thr group

    //save what chat is going on
    const [chat, setChat] = useState([]);

    
    //
    const [msg, setMsg] = useState('');
    const [user, setUser] = useState('');

    const [username, setUsername] = useState('');
    
    //set informaiton about the group
    const [groupName, setGroupName] = useState('');
    const [members, setMembers] = useState([]);

    const fetchGroupData = async () => {
        try {
            const docRef = doc(db, "groups", groupId);
            const groupDocSnap = await getDoc(docRef);
            if (groupDocSnap.exists()) {
                
                const groupData = groupDocSnap.data();
                
                setGroupName(groupData.groupName);//set the group name
                
                setMembers(groupData.members || []);//set members in the group
               
            } else {
                console.log("Group does not exist");
            }
        } catch (error) {
            console.log("Error fetching group data:", error);
        }
    };

    //fetch all the chat data
    const fetchChat = async () =>{
        try{
            const docRef = doc(db, "chats", chatId);
            const chatDocSnap = await getDoc(docRef);
            if (chatDocSnap.exists()) {

                const chatData = chatDocSnap.data();
                console.log(chatData);


            } else {
                console.log("Group does not exist");
            }
        }
        catch (error) {
            console.log("Error fetching chat data:", error);
        }
    };


    //get all the messages from the chat
    //fetch chat messages from the messages sub-collection inside the chats collection
    const fetchMessages = async () => {
        try {
            const messagesRef = collection(db, "chats", chatId, "messages");//collection from the message
            const q = query(messagesRef, orderBy("createdAt", "asc"));
            onSnapshot(q, (snapshot) => {
                const messagesData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setChat(messagesData);
            });
        } catch (error) {
            console.log("Error fetching messages:", error);
        }
    };

    //fetch the users user name so it can be stored for messages
    const getUsername = async () =>{
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            
            setUsername(userData.username);

            console.log(username); 

        } else {
            console.log("No such document!");
        }
    }


    //handle sending a message to the chat
    const handleSend = async () => {
        if (!msg.trim()) return; //do not send empty messages

        try {
            const messagesRef = collection(db, "chats", chatId, "messages"); //collection inside the collection

            //add the new message to Firestore with sender ID message text and current time
            await addDoc(messagesRef, {
                text: msg,
                senderId: user.uid, //store the current user id
                senderName: username || "No username", //get the users user name
                createdAt: serverTimestamp(), //save the timestamp of the message
            });


            //after successfully adding the message update the latest message in the group document
            //this so so latest meassage is traped
            await updateDoc(doc(db, "groups", groupId), {
                latestMessage: {
                    text: msg,
                    senderName: username || "No username", //store the user username
                    createdAt: serverTimestamp(), //timestamp of the latest message
                }
            });



            setMsg(''); //clear the message input after sending
        } catch (error) {
            console.log("Error sending message:", error);
        }
    };


    //additional featues with no user story
    //be able to edit a message you sent
    /*will be used in the second sprint to imporve user control and how they interact
    const handleEdit = async () => {

    };

    //be able to delete a message you sent
    const handleDelete = async () =>{

    };
    */

    //to get the groups data
    //runs everytime the group id changes
    useEffect(() => {

        fetchGroupData();
        fetchChat();
        fetchMessages();

        // Check the auth state of the user
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);  //set the user
            } else {
                setShow(false); //no user
            }
        });

        return () => unsubscribe();  //cleanup the auth listener

    }, [groupId]);

    //auto scroll to bottom
    const endRef = useRef(null);
    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [show, chat]);
    

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
                
                getUsername();

            } else {
                //console.log("You are NOT in the group");
                //console.log(members);
                setShow(false); //hide the chat if user not in group
            }
        }
    }, [members, user]);  //re-run this effect whenever members or user changes


    
    
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
                {/*used to get back to the home page
                <Button variant="primary" onClick={handleNavDash}>
                    Dashboard
                </Button>
                */}
                <Button variant="primary" onClick={handleNavGroup}>
                    Back to Groups
                </Button>
                
            </div>


            {/*check to see if the user is in the group */
             show?   
                //user is in the group
                <div className="inGroup">
                    <h2>Chat for: {groupName}</h2>

                    <div className="messages">
                        {chat.map(message => (
                            <div
                            className={message.senderId === user?.uid ? "message own" : "message"}
                            key={message.id}
                            >
                            <p className="username">From: {message.senderName}</p>
                                <p className="text">{message.text}</p>
                                <span className="time">Sent at: {message.createdAt?.toDate().toLocaleString()}</span>
                            </div>
                        ))}
                        <div ref={endRef}></div>
                    </div>



                    <div className='sender'>
                        <input 
                            value={msg} 
                            onChange={(e) => setMsg(e.target.value)} 
                            placeholder="Type a message"
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>:
                //the user not in the group
                <div className="notInGroup">
                    <h2>You are not a member of this group. Please exit this page</h2>
                </div>
            }
        </div>
    );
    
};


export default Chat; //exports the chat function to main