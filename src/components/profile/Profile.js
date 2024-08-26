import { toast } from "react-toastify";
import { setDoc } from "firebase/firestore";

const Profile = () => {
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
      await setDoc(doc(db, "users", res.user.uid), {
        firstname,
        lastname,
        age,
        gender,
        pronouns,
      });

      toast.success("Profile created!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div calssName="profile">
      <div calssName="item">
        <h2>Please create a profile!</h2>
        <form onSubmit={handleProfile}>
          <input type="text" placeholder="First Name" name="fisrtname" />
          <input type="text" placeholder="Last Name" name="lastname" />
          <input type="number" placeholder="25Age" name="age" />
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
