import { toast } from "react-toastify";

// helper function to get profile data
export const loadProfile = async (
  userId,
  fetchUserProfile,
  setOtherProfileData,
  setLoading
) => {
  try {
    setLoading(true);
    /* check if paramater userId is present and set profile data based on userId */
    if (userId) {
      const userProfile = await fetchUserProfile(userId);
      if (userProfile) {
        setOtherProfileData(userProfile);
        toast.success("Profile loaded successfully!"); // success message
      } else {
        toast.error("Profile not found!"); // error message if no profile data found
      }
    }
  } catch {
    toast.error("Error fetching profile"); // error in getting data message
  } finally {
    setLoading(false);
  }
};
