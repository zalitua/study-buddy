import React from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { v4 } from "uuid";

import { db, storage } from "../../../lib/firebase";
import { useUserAuth } from "../../../context/userAuthContext";

// add a user's profile pic
const ProfilePic = ({ onImageUpload }) => {
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

      onImageUpload(url);

      // success message
      toast.success("Profile image added successfully!", {
        position: "top-center",
        autoClose: 1000,
      });
    } catch (err) {
      //error when profile image doesn't upload
      toast.error("Failed to add profile image!", {
        position: "top-center",
        autoClose: 2000,
      });
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
};

export default ProfilePic;
