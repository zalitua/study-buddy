import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../../context/UserAuthContext";

//Main UI. Displays relevant information for the user and allows site navigation
const Home = () => {
  //logout option
  const { logOut } = useUserAuth();
  const navigate = useNavigate();

  const handleNavLogin = async () => {
    try {
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNavSignup = async () => {
    try {
      navigate("/signup");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNavProfile = async () => {
    try {
      navigate("/profilePage");
    } catch (error) {
      console.log(error.message);
    }
  };

  /* const handleNavChat = async () => {
    try {
      navigate("/chat");
    } catch (error) {
      console.log(error.message);
    }
  }; */

  const handleNavGroup = async () => {
    try {
      navigate("/group");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNavCalendar = async () => {
    try {
      navigate("/calendar");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNavDashboard = async () => {
    try {
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNavLeaderboard = async () => {
    try {
      navigate("/leaderboard");
    } catch (error) {
      console.log(error.message);
    }
  };

  // New: Handle navigation to Tasks
  const handleNavTasks = async () => {
    try {
      navigate("/tasks");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleForum = async () => {
    try {
      navigate("/forumHome");
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <>
      <div className="p-4 box mt-4 text-center">
        <h4>Welcome to StudyBuddy</h4>
      </div>
      <div className="d-grid gap-2">
        <Button variant="primary" onClick={handleNavLogin}>
          Login
        </Button>
        <Button variant="primary" onClick={handleNavSignup}>
          Sign Up
        </Button>
        <Button variant="primary" onClick={handleNavProfile}>
          Profile
        </Button>

        <Button variant="primary" onClick={handleNavGroup}>
          Group
        </Button>
        <Button variant="primary" onClick={handleNavCalendar}>
          Calendar
        </Button>
        <Button variant="primary" onClick={handleNavDashboard}>
          Dashboard
        </Button>
        <Button variant="primary" onClick={handleNavLeaderboard}>
          Leaderboard
        </Button>
        {/* New Button for Tasks */}
        <Button variant="primary" onClick={handleNavTasks}>
          Tasks
        </Button>
        <Button variant="primary" onClick={handleForum}>
          Forums
        </Button>
        <Button variant="primary" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </>
  );
};

export default Home;
