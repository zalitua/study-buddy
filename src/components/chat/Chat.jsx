//file which stores the majority of the chat functions
import { Button } from "react-bootstrap";

import './chat.css'
import { auth } from "../../lib/firebase";
import { db } from "../../lib/firebase";

import React, { useEffect, useState } from 'react'


//import { database, provider } from './firebaseAuth'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'



import { useNavigate } from "react-router-dom"; //Used for react router to get to this page



const Chat = () =>{
    const [msg,setMsg] = useState('')
    const [show,setShow] = useState(false)
    const [user,setUser] = useState('')
    const [data,setData] = useState([])
    const [update,setUpdate] = useState(false)
    const [id,setId] = useState('')


    
    const ref = collection(db,'message')

    //keep messages uptodate 
    useEffect(()=>{
        auth.onAuthStateChanged(data=>{
            setUser(data?.providerData[0])
            if(data?.providerData[0]){
                setShow(true)
            }
        })
        

        //live update the messages
        onSnapshot(query(ref, orderBy('date', 'asc')), (snapshot) => {
            const updatedData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setData(updatedData);
        });
        console.log("first")
    },[])


    //handle send
    const handleSend =async()=>{
        if(update){
            const editRef = doc(db,'message',id)
            await updateDoc(editRef,{message:msg})
            setUpdate(false)
            setMsg('')
        }else{
            await addDoc(ref,{name:user.displayName,uid:user.uid,message:msg,date:new Date()})
            setMsg('')
        }
    }
    const handleUpdate =async(edit,val)=>{
        console.log(val)
        if(edit == 'Y'){
            setUpdate(true)
            setMsg(val.message)
            setId(val.id)
        }
    }
    const handleDelete =async(del,id)=>{
        if(del== 'Y'){
            setUpdate(false)
            setMsg('')
            const delRef = doc(db,'message',id)
            await deleteDoc(delRef)
        }
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

            {/*check to see if the user is in the group / signed in*/
                show?
                <div>
                <div className='message'>
                    {
                        data.map(res=><div  className={user.uid == res.uid?'right':'left'}>
                            <div onClick={()=>handleUpdate(user.uid == res.uid?"Y":"N",res)} onDoubleClick={()=>handleDelete(user.uid == res.uid?"Y":"N",res.id)} className='container'>
                                <label>{res.name}</label><br/><br/>
                                <label>{res.message}</label>
                            </div>
                        </div>)
                    }
                </div>
                <div className='sender'>
                    <input value={msg} onChange={(e)=>setMsg(e.target.value)} />
                    <button onClick={handleSend}>{update?'Update':'Send'}</button>
                </div>
            </div>:
            <button>sign in</button>
            }
        </div>
    );
    
};


export default Chat; //exports the chat function to main