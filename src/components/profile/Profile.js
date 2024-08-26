import { useState } from "react";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Profile = () => {
  const [user] = useAuthState(auth); //get the current user
  const [loading, setLoading] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { firstname, lastname, age, gender, pronouns } =
      Object.fromEntries(formData);

    if (!firstname || !lastname || !age || !gender || pronouns)
      return toast.warn("Please enter inputs!");

    try {
      if (!user) {
        toast.error("No authenticated user found!");
        setLoading(false);
        return;
      }

      const parsedAge = parseInt(age, 10);
      if (isNaN(parsedAge)) {
        toast.warn("Age must be a number!");
        setLoading(false);
        return;
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          firstname,
          lastname,
          age: parsedAge,
          gender,
          pronouns,
        },
        { merge: true }
      );

      toast.success("Profile created!");
      // redirect to dashboard here
      e.target.reset();
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Profile not created. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">
      <div className="item">
        <h2>Please create a profile!</h2>
        <form onSubmit={handleProfile}>
          <input type="text" placeholder="First Name" name="firstname" />
          <input type="text" placeholder="Last Name" name="lastname" />
          <input type="number" placeholder="Age" name="age" required min="0" />
          <input type="text" placeholder="Gender" name="gender" />
          <input type="text" placeholder="Pronouns" name="pronouns" />
          <button disabled={loading}>
            {loading ? "Loading" : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
