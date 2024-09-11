Getting the authenticated user to use on a page:

//import:
import { useUserAuth } from "../../context/userAuthContext";

//get reference to the user that is logged in:
const { user } = useUserAuth(); //get the current user

//example, used to query any data about the specific user:

user.uid 