import { Button } from "react-bootstrap";
import { useState } from "react";
import "./group.css"
import { auth } from "../../lib/firebase";
import { db } from "../../lib/firebase";

import { useNavigate } from "react-router-dom"; //Used for react router to get to this page



const Group = () => {

    //Seach users


    //Group creation


    //Show users groups




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
                    <button >Create</button>
                    
                </div>
                <div className="current">
                    <h1>current groups</h1>
                </div>
            </div>
        </div>
    );
};


export default Group