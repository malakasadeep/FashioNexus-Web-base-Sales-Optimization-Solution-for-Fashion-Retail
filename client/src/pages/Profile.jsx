import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserstart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserstart,
  deleteUserSuccess,
  signOutUserstart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUserEdit, FaTrash, FaCheckCircle, FaSpinner } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `avatars/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserstart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error}`,
        });
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Profile updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error}`,
      });
    }
  };

  const handleDeleteUser = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d4a373",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          dispatch(deleteUserstart());
          const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success === false) {
            dispatch(deleteUserFailure(data.message));
            return;
          }
          dispatch(deleteUserSuccess(data));
          Swal.fire({
            title: "Deleted!",
            text: "Your account has been deleted.",
            icon: "success",
          });
        } catch (error) {
          dispatch(deleteUserFailure(error.message));
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow flex items-center justify-center p-6"
        style={{ backgroundColor: "" }}
      >
        <div className="bg-SecondaryColor p-6 rounded-xl mt-20 shadow-xl max-w-lg w-full">
          <h1
            className="text-3xl font-bold text-center mb-6"
            style={{ color: "#a98467" }}
          >
            Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center">
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
              />
              <motion.img
                src={formData.avatar || currentUser.avatar}
                alt="profile"
                className="rounded-full h-24 w-24 object-cover cursor-pointer mb-2"
                onClick={() => fileRef.current.click()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
              <p className="text-sm">
                {fileUploadError ? (
                  <span className="text-red-600">Error uploading image</span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className="text-gray-600">{`Uploading ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span className="text-green-600">Upload complete!</span>
                ) : null}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                id="firstname"
                placeholder="First Name"
                className="border p-3 rounded-lg w-full"
                defaultValue={currentUser.firstname}
                onChange={handleChange}
              />
              <input
                type="text"
                id="lastname"
                placeholder="Last Name"
                className="border p-3 rounded-lg w-full"
                defaultValue={currentUser.lastname}
                onChange={handleChange}
              />
            </div>

            <input
              type="text"
              id="username"
              placeholder="Username"
              className="border p-3 rounded-lg w-full"
              defaultValue={currentUser.username}
              onChange={handleChange}
            />

            <input
              type="email"
              id="email"
              placeholder="Email"
              className="border p-3 rounded-lg w-full"
              defaultValue={currentUser.email}
              onChange={handleChange}
              readOnly={true}
            />

            <button
              type="submit"
              className="w-full bg-[#d4a373] text-white p-3 rounded-lg flex items-center justify-center hover:bg-[#a98467] transition duration-300"
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaUserEdit className="mr-2" />
              )}
              {loading ? "Updating..." : "Update Profile"}
            </button>

            <motion.div
              onClick={handleDeleteUser}
              className="cursor-pointer w-full bg-red-600 text-white p-3 rounded-lg text-center hover:bg-red-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTrash className="mr-2 inline" /> Delete Account
            </motion.div>

            {updateSuccess && (
              <p className="text-center text-green-600">
                <FaCheckCircle className="inline mr-1" /> Profile updated
                successfully!
              </p>
            )}

            {error && (
              <p className="text-center text-red-600">
                <FaCheckCircle className="inline mr-1" /> {error}
              </p>
            )}
          </form>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
