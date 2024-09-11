//file which stores the majority of the chat functions
import { Button } from "react-bootstrap";
import { useState } from "react";
import './chat.css'
import { auth } from "../../lib/firebase";
import { db } from "../../lib/firebase";


import { useNavigate } from "react-router-dom"; //Used for react router to get to this page



const Chat = () =>{
    const [msg, setmsg] = useState('');
    const [show, setShow] = useState(true); //is the user loged in or in the group


    //console.log(msg) //used to test if the message typed gets loged to the varaible
    const handleSSO = () => {

    }

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

            {//check to see if the user is in the group / signed in
                show?
            <div>
                <div className="messages">
                    <h1>messages</h1>
                    
                </div>
                <div className="sender">
                    <input placeholder="Lorem ipsum, dolor sit amet consectetur adipisicing elit." value={msg} onChange={(e) => setmsg(e.target.value)} />
                    <button>Send</button>
                </div>
            </div>:
            <button>sign in</button>
            }
        </div>
    );
    
};


export default Chat; //exports the chat function to main