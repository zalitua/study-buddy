//navigation to all the forums
import { Navigate, useNavigate } from "react-router-dom";
import "./forumHome.css"
import { Button } from "react-bootstrap";
import { useEffect } from "react";


const ForumHome = () =>{


    



    //track any new forums
    useEffect (() => {

    }, []);




    const navigate = useNavigate();
    const handleNavDash = async () => {
      //handle user going to the dash
      try {
        navigate("/");
      } catch (error) {
        console.log(error.message);
      }
    };
    //handle going to each forum page
    const handleForumPages = async (forumId) => {
        try {
          navigate(`/forumHome/:${forumId}`);
        } catch (error) {
          console.log(error.message);
        }
    };



    return (
        <>
            <Button variant="primary" onClick={handleNavDash}>
                Back to home
            </Button>


            <h1>Forums</h1>

            {/*get all of the forums that exist*/}
            <h2>forum name</h2>
            <Button variant="primary" onClick={handleForumPages}>Forum name button</Button>



        </>
    );

};

export default ForumHome