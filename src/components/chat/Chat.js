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


    const navigate = useNavigate();

    const handleNavDash = async () => {
        //handle user going back to the dash
        try {
            navigate("/");
        } catch (error) {
            console.log(error.message);
        }
    };
    

    //console.log(msg) //used to test if the message gets taken
    const handleSSO = () => {

    }


    return(
        <div >
            <div className="navbar">

                <Button variant="primary" onClick={handleNavDash}>
                    Dashboard
                </Button>
                <Button variant="primary" onClick={handleNavDash}>
                    Dashboard
                </Button>
                <Button variant="primary" onClick={handleNavDash}>
                    Dashboard
                </Button>
                <Button variant="primary" onClick={handleNavDash}>
                    Dashboard
                </Button>
            </div>

            {//check to see if the user is in the group / signed in
                show?
            <div>
                <div className="messages">
                    <h1>messages</h1>
                </div>
                <div className="sender">
                    <input value={msg} onChange={(e) => setmsg(e.target.value)} />
                    <button>Send</button>
                </div>
            </div>:
            <button>sign in</button>
            }
        </div>
    );
    
};


export default Chat; //exports the chat function to main