import { useState } from "react";
import { Button } from "react-bootstrap";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../lib/firebase";
import { db } from "../../lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useUserAuth } from "../../context/UserAuthContext";
import { v4 } from "uuid";

// add a user's profile pic
function ProfilePic() {
  const { user } = useUserAuth();
  const [imageUpload, setImageUpload] = useState(null);
  const [error, setError] = useState("");

  const uploadFile = async () => {
    if (imageUpload == null) return;

    try {
      // set up to save the image in firebase storage in the images directory
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);

      await uploadBytes(imageRef, imageUpload);

      const url = await getDownloadURL(imageRef);

      await setDoc(
        doc(db, "users", user.uid), // Reference to the current user's document
        { profileImageUrl: url }, // Add the image URL to the user's document
        { merge: true } // Merge the new data with existing fields
      );

      alert("Profile image uploaded!"); // success message
    } catch (err) {
      setError("Error uploading image: " + err.message);
    }
  };

  // input for the image file and a button to upload the image
  return (
    <div className="d-grid gap-2 mt-3">
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <Button variant="primary" onClick={uploadFile}>
        {" "}
        Upload Image
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default ProfilePic;
