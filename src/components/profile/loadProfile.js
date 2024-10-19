import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const loadProfile = async (
  userId,
  fetchUserProfile,
  setOtherProfileData,
  setLoading
) => {
  try {
    setLoading(true);
    if (userId) {
      const userProfile = await fetchUserProfile(userId);
      if (userProfile) {
        setOtherProfileData(userProfile);
        toast.success("Profile loaded successfully!"); // Success message
      } else {
        toast.error("Profile not found!"); // Error message
      }
    }
  } catch {
    toast.error("Error fetching profile"); // Error message
  } finally {
    setLoading(false); // Ensure loading is false regardless of the outcome
  }
};
