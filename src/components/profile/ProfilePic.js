//import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../lib/firebase";
import { db } from "../../lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useUserAuth } from "../../context/UserAuthContext";
import { toast } from "react-toastify";
import { v4 } from "uuid";

// add a user's profile pic
function ProfilePic() {
  const { user } = useUserAuth();

  const uploadFile = async (imageUpload) => {
    if (!imageUpload) return;

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

      // success message
      toast.success("Profile image added successfully!", {
        position: "top-center",
        autoClose: 1000,
      });
    } catch (err) {
      toast.error("Failed to add profile image!", { position: "top-center" });
    }
  };

  // input for the image file and a button to upload the image
  return (
    <div className="d-grid gap-2 mt-3">
      <input
        type="file"
        onChange={(event) => uploadFile(event.target.files[0])}
      />
    </div>
  );
}

export default ProfilePic;
