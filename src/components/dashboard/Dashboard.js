import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../../context/userAuthContext";

//Main UI. Displays relevant information for the user and allows site navigation
const Dashboard = () => {
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
      navigate("/profile");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNavChat = async () => {
    try {
      navigate("/chat");
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

  const handleNavLeaderboard = async () => {
    try {
      navigate("/leaderboard");
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

  return (
    <>
      <div className="p-4 box mt-3 text-center">
        Welcome to StudyBuddy
        <br />
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
        <Button variant="primary" onClick={handleNavChat}>
          Chat
        </Button>
        <Button variant="primary" onClick={handleNavCalendar}>
          Calendar
        </Button>
        <Button variant="primary" onClick={handleNavLeaderboard}>
          Leaderboard
        </Button>
        <Button variant="primary" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </>
  );
};

export default Dashboard;
