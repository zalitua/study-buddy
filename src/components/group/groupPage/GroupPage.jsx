//Group page
//used as the home page for each group
//has info like the people in the group 

//members main page for the group

import React, { useState, useEffect } from "react";
import "./groupPage.css";
import { Button } from "react-bootstrap";



const GroupPage = () => {

    const [groupName, setGroupName] = useState("")

    const [members, setMembers] = useState([]);



    useEffect(() => {
        
    }, []);


    return (
        <div className="groupPage">
            <h1 className="groupName">{groupName || "No group name" }</h1>

            <div className="groupButtons">
                <Button disabled="true" variant="disabled">Edit Group</Button>
                <Button>Chat</Button>
                <Button>Leave Group</Button>
            </div>

            <h2>Members</h2>
            <ul>
                {members.length > 0 ? (
                members.map((member) => (
                    <li key={member.id}>
                        {member.name} {/*Could also include their role in sprint 3*/}
                    </li>
                ))
                ) : (
                    <li>No members in this group.</li>
                )}
            </ul>

            <h2>Latest message</h2>
        </div>
    );
};

export default GroupPage;
