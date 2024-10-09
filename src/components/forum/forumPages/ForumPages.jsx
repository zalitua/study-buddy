//Specific forum templates 
import { collection, onSnapshot, query } from "firebase/firestore";
import "./forumPages.css"
import { Button } from "react-bootstrap";
import { db, auth } from "../../../lib/firebase";
import { useParams } from "react-router-dom";


const ForumPage = () =>{
    //hosts the forum 
    //can send and see messages here


    const {forumId} = useParams(); //get the wanted forum ID


    

    



    return (

        <>
            <h1>name of forum</h1>


        </>
    );

};

export default ForumPage