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

    // used for testing the passing of the IDs
    //console.log("chatId from chat: " + chatId);
    //console.log("groupId from chat: " + groupId);


    const [msg, setMsg] = useState('');
    const [user, setUser] = useState('');
    const [data, setData] = useState([]);


    const [groupName, setGroupName] = useState('');

    const [groupData, setGroupData] = useState([]); //not sure if using

    const fetchGroupData = async () => {
        try {
            const docRef = doc(db, "groups", groupId);
            const groupDocSnap = await getDoc(docRef);
            if (groupDocSnap.exists()) {
                //console.log(groupDocSnap.data())
                const groupData = groupDocSnap.data();
                
                setGroupName(groupData.groupName); // Set the group name here
                //console.log(groupName);

            } else {
                console.log("Group does not exist");
            }
        } catch (error) {
            console.log("Error fetching group data:", error);
        }
    };
    


    useEffect(() => {

        fetchGroupData();
    }, [groupId]);
    

    //used to check if the user is in the group
    //if in the group allow them to message
    //if not tell them page not found (would only happen if they typed in the link)
    const checkInGroup = (()=>{
        if (auth.currentUser.id in groupData){
            console.log()
            return true;
        }
        else{
            return false;
        }




    });
    


    
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


            {/*check to see if the user is in the group / signed in*/
                
                
                <div>
                    <h2>Chat for: {groupName}</h2>
                    <div className='message'>
                        
                    </div>
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
            </div>
            }
        </div>
    );
    
};


export default Chat; //exports the chat function to main