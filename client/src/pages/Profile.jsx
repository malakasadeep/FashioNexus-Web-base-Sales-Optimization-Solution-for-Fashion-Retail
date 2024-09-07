import { useSelector } from "react-redux";
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
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  //firebase storage rules
  //allow read;
  //allow write: if
  //request.resource.size < 2 * 1024 * 1024 &&
  //request.resource.contentType.matches('image/.*')

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
      confirmButtonColor: "#3085d6",
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

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserstart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

  return (
    <div className="mt-28 mb-12">
      <div className="p-3 max-w-lg mx-auto bg-white/50 z-10 backdrop-filter backdrop-blur-lg shadow-lg rounded-2xl">
        <Link to={"/seller/profile"}>
          <button className="bg-blue-600 rounded-xl text-white ml-1 mt-1 text-4xl">
            <IoMdArrowRoundBack />
          </button>
        </Link>
        <h1 className="text-3xl font-semibold text-center ">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 transition duration-300 ease-in-out hover:scale-125"
          />

          <p className="text-sm self-center font-semibold">
            {fileUploadError ? (
              <span className="text-red-700">Error image upload</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-700">
                Image upload successfully!!
              </span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            className="border p-3 rounded-lg"
            id="usertype"
            defaultValue={currentUser.usertype}
            onChange={handleChange}
            readOnly
          />
          <div className="flex flex-row ">
            <input
              type="text"
              placeholder="Fitst Name"
              id="firstname"
              className="border p-3 rounded-lg w-56"
              defaultValue={currentUser.firstname}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Last Name"
              id="lastname"
              className="border p-3 rounded-lg w-56 ml-10 "
              defaultValue={currentUser.lastname}
              onChange={handleChange}
            />
          </div>
          <input
            type="text"
            placeholder="Username"
            className="border p-3 rounded-lg"
            id="username"
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg"
            id="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Country"
            className="border p-3 rounded-lg"
            id="country"
            defaultValue={currentUser.country}
            onChange={handleChange}
          />
          <button className="bg-slate-700 text-yellow-200 rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Loading..." : "update"}
          </button>
          <p className="bg-green-700 text-yellow-200 rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 text-center cursor-pointer">
            Reset Password
          </p>

          <span
            onClick={handleDeleteUser}
            className="bg-red-700 text-yellow-200 rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer text-center"
          >
            Delete account
          </span>
        </form>

        <p className="text-red-700 mt-5">{error ? error : ""}</p>
        <p className="text-green-700 mt-5 font-semibold">
          {updateSuccess ? "User is updated successfully!!" : ""}
        </p>
      </div>
    </div>
  );
}
