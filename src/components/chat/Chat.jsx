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
     getDocs, onSnapshot, orderBy, 
     query, updateDoc } 
    from 'firebase/firestore'

import { useNavigate } from "react-router-dom"; //used for react router to get to this page



const Chat = () =>{

    const { chatId, groupId } = useParams(); // Extracts groupId and chatId from the URL

    console.log("chatId from chat: " + chatId);
    console.log("groupId from chat: " + groupId);

    


    
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
                    Group
                </Button>
                
            </div>

            {/*check to see if the user is in the group / signed in*/
                
                <div>
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