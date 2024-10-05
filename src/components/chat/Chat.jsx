//file which stores the majority of the chat functions
import { Button, Modal } from "react-bootstrap";




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
     query, updateDoc, deleteDoc} 
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


    //track the messsage being edited and save its content
    const [editingMsgId, setEditingMsgId] = useState(null);  
    const [editMsgContent, setEditMsgContent] = useState('');  

    //track the message that needs deletion
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [messageToDelete, setMessageToDelete] = useState(null);


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

            //console.log(username); 

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


    
    //Sprint 2 features
    //able to handle editing any of the messages you have sent
    const handleEdit = async (message) => {
        //get the message that is wanting to be edited
        //check if the user is the one who sent it

        if (message.senderId === user.uid) { //only allow the user to edit their own messages
            setEditingMsgId(message.id); //store the message ID being edited
            setEditMsgContent(message.text); //set the content to be edited in the input
        }
    };

    const saveEditedMessage = async () => {
        if (!editMsgContent.trim()) return;//DON'T allow empty message

        try {
            //get the ref for the specific message
            const messageRef = doc(db, "chats", chatId, "messages", editingMsgId);

            //update the message text and time stamp
            await updateDoc(messageRef, {
                text: editMsgContent,
                editedAt: serverTimestamp()//when the message was edited
            });

            //clear the editing state
            setEditingMsgId(null);
            setEditMsgContent('');
        } catch (error) {
            console.log("Error editing message:", error);
        }
    };

    //caneling editing the message
    const cancelEdit = () => {
        setEditingMsgId(null);//no longer editing a message
        setEditMsgContent('');//clear the input
    };



    //be able to delete a message you sent
    const handleDelete = (messageId) => {
        setMessageToDelete(messageId); // Set the message to be deleted
        setShowDeleteModal(true); // Show the delete confirmation modal
    };

    // Confirm deletion
    const confirmDelete = async () => {
        if (messageToDelete) {
            try {
                const delRef = doc(db, "chats", chatId, "messages", messageToDelete);
                await deleteDoc(delRef);
                setMessageToDelete(null); // Clear after deletion
                setShowDeleteModal(false); // Close modal
            } catch (error) {
                console.log("Error deleting message:", error);
            }
        }
    };

    // Cancel deletion
    const cancelDelete = () => {
        setMessageToDelete(null); // Clear the message to delete
        setShowDeleteModal(false); // Close modal
    };

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
                
                setShow(true); //show the chat if user in group
                
                getUsername();

            } else {
                
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

                                {/*check to see if message is being edited display the editing options if it needs editing*/}
                                {editingMsgId === message.id ? (
                                    <div className="edit-message">
                                        <input 
                                            value={editMsgContent}
                                            onChange={(e) => setEditMsgContent(e.target.value)}
                                        />
                                        <button onClick={saveEditedMessage}>Save</button>
                                        <button onClick={cancelEdit}>Cancel</button>
                                    </div>
                                ) : (
                                    <div>
                                        {/*check and display the messageexists*/}
                                        <p className="text">{message?.text}</p>

                                        {/*check and display the time sent*/}
                                        <p className="time">Sent at: {message.createdAt?.toDate ? message.createdAt.toDate().toLocaleString() : 'Unknown time'}</p>
                                        
                                        {/*if a message has been edited display when it was edited*/}
                                        {message.editedAt && (
                                            <p className="edited">
                                                Edited at: {message.editedAt.toDate().toLocaleString()}
                                            </p>
                                        )}

                                        {/* Show edit/delete buttons only for the user's own messages */}
                                        {message.senderId === user?.uid && (
                                            <div>
                                                <button onClick={() => handleEdit(message)}>Edit</button>
                                                <button onClick={() => handleDelete(message.id)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                )}
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
            {/*deletion confirmation*/}
            <Modal show={showDeleteModal} onHide={cancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete message?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    This will remove the message for everyone, but people may have seen it already.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
    
};


export default Chat; //exports the chat function to main