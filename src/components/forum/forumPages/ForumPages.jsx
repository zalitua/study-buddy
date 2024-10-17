import { addDoc, collection, doc, getDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import "./forumPages.css";
import { Button } from "react-bootstrap";
import { db, auth } from "../../../lib/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const ForumPage = () => {
  const { forumId } = useParams(); // Get the forum ID

  //messgage to send
  const [msg, setMsg] = useState('');

  //messages in the chat
  const [messages, setMessages] = useState([]); // State for storing fetched messages

  //get user specific info
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);

  //get the forums name
  const [forumName, setForumName] = useState('');

  //fetch the username for the current user
  const getUsername = async () => {
    if (!auth.currentUser) return;
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      setUsername(userData.username);
    } else {
      console.log("No such document!");
    }
  };

  //get the name of the forum
  const getForumName = async () => {
    const forumRef = doc(db, "forums", forumId);
    const forumSnap = await getDoc(forumRef);

    if (forumSnap.exists()) {
      const forumData = forumSnap.data();
      setForumName(forumData.name);
    } else {
      console.log("No forum found!");
    }
  };


  //send a message in the specific forum
  const sendMessage = async () => {
    if (!msg.trim()) return; //no empty messages

    try {
      const messagesRef = collection(db, "forums", forumId, "messages"); //reference to the forum messages subcollection

      await addDoc(messagesRef, {
        text: msg,
        senderId: user.uid, //users id
        senderName: username || "No username", //current user username
        createdAt: serverTimestamp(), //when the message was sent
      });

      setMsg(''); //clear message input after sending

    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  //get the messages from the forums messages
  const getMessages = () => {
    const messagesRef = collection(db, "forums", forumId, "messages"); //reference to the forum messages subcollection
    const q = query(messagesRef, orderBy("createdAt", "asc")); //order messages by creation time

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages); //update messages
    });

    return unsubscribe; //unsubscribe from real-time updates on component unmount
  };

  //initialize user and set up message listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser); //set the current user
        getUsername(); //fetch the current users username
      } else {
        console.log("No user found"); //no authenticated user
      }
    });

    return () => unsubscribe();
  }, [forumId]);

  //fetch messages in whenever forumId changes
  useEffect(() => {
    if (forumId) {
      const unsubscribe = getMessages();
      getForumName();
      return () => unsubscribe(); //clean up listener on unmount
    }
  }, [forumId]);


  //auto scroll to bottom
  const endRef = useRef(null);
  useEffect(() => {
      if (endRef.current) {
          endRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);
  


  const navigate = useNavigate();
  const handleForum = async () => {
    try {
      navigate("/forumHome"); //go back to the forum home page
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="forumPage">
      <div className="nav">
        <Button variant="primary" onClick={handleForum}>
          Back
        </Button>
      </div>

      <h1 className="title">{forumName || "Loading forum..."}</h1>

      <div className="messagesContainer">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <p className="username">{message.senderName}:</p>
            <p> {message.text}</p>
            <span>{message.createdAt?.toDate ? message.createdAt.toDate().toLocaleString() : 'Unknown time'}</span>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      <div className="inputContainer">
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type your message..."
        />
        <Button onClick={sendMessage} disabled={!msg.trim()}> 
          Send
        </Button>
      </div>
    </div>
  );
};

export default ForumPage;
