//Group page
//used as the home page for each group
//has info like the people in the group 

//members main page for the group

import React, { useState, useEffect } from "react";
import "./groupPage.css";
import { Button } from "react-bootstrap";


import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import ProfileFeature from "../../profile/ProfileFeature";


//import {ProfileFeature} from "../../../context/ProfileFeature";



const GroupPage = () => {

    const {groupId} = useParams();


    //group info
    const [group, setGroup] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [members, setMembers] = useState([]);//only does the ids right now

    //users info
    const [users, setUsers] = useState([]);

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

               
            } else {
                console.log("Group does not exist");
            }

            
      
          } catch (error) {
            console.log("Error fetching group: ", error);
          }

          
        

    }

    //fetch the users data
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




    //group use effect
    //run each time the group id changes
    useEffect(() => {
        fetchGroup();
        

        console.log(members);
        console.log("users");
        console.log(users);

        
    }, []);

    //users use effect
    //run each time the members list changes
    useEffect(() => {
        if (members.length > 0) {
            fetchUsersInGroup();
        }
    }, [members]);


    return (
        <div className="groupPage">
            <h1 className="groupName">{groupName || "No group name" }</h1>

            
            <div className="groupButtons">
                <Button disabled={true} variant="disabled">Edit Group</Button>
                <Button>Chat</Button>
                <Button>Leave Group</Button>
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

            <h2>Latest message</h2>
        </div>
    );
};

export default GroupPage;
