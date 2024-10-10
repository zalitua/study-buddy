//navigation to all the forums
import { useNavigate } from "react-router-dom";
import "./forumHome.css"
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { db, auth } from "../../lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";


const ForumHome = () =>{



  const [forums, setForums] = useState([]);


  //get all the forums
  const fetchForums = () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("User not logged in!!!");
        return;
      }

      const forumsRef = collection(db, "forums");
      const q = query(forumsRef);

      // Listen for changes in the 'forums' collection
      onSnapshot(q, (snapshot) => {
        const forumList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setForums(forumList); // Update state with fetched forums
      });
    } catch (error) {
      console.log("Error fetching forums: ", error);
    }
  };
  

  

  //track any new forums
  useEffect(() => {
    fetchForums();
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
        navigate(`/forumHome/${forumId}`);
      } catch (error) {
        console.log(error.message);
      }
  };


  return (
      <div className="forumHome" >
         <div className="nav">
            <Button variant="primary" onClick={handleNavDash}>
                Back to home
            </Button>
          </div>


          <h1 className="title">Forums</h1>

          <div className="forumsList">
            {/*get all of the forums that exist*/}
            {forums.length > 0 ? (
              forums.map((forum) => (
                <div key={forum.id} className="forum-item">
                  <h2>{forum.name}</h2>
                  <Button
                    variant="primary"
                    onClick={() => handleForumPages(forum.id)}  /*when clicked navigate to the forum using its ID*/
                    className="navForums"
                  >
                    Go to {forum.name}
                  </Button>
                </div>
              ))
            
            ) : (
              <p>No forums available.</p>
            )}
          </div>


      </div>
  );

};

export default ForumHome