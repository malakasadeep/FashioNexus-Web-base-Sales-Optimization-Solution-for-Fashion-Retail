import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast styling
import { useEffect } from "react";

export default function PrivateCus() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate(); // useNavigate for manual redirection

  useEffect(() => {
    if (!currentUser) {
      // Display the toast message
      toast.error("Please log in to access this content.", {
        position: "top-right",
        autoClose: 3000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect after a short delay (e.g., 3 seconds)
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return (
      <>
        <ToastContainer /> {/* Toast container to display the messages */}
      </>
    );
  }

  return (
    <>
      <ToastContainer />{" "}
      {/* Ensure the toast container is available for the entire app */}
      <Outlet />
    </>
  );
}
