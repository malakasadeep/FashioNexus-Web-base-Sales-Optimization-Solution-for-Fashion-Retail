import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateAdmin() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.ismanager === true ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
}
