import express from "express";
import {
  addUser,
  deleteUser,
  deleteUserByid,
  getAllUsers,
  getUser,
  getUserSearch,
  test,
  updateUser,
} from "../controllers/user.controllers.js";
import { veryfyTocken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/all-Users", getAllUsers);
router.delete("/delete-user/:id", deleteUserByid);
router.get("/test", test);
router.post("/add", addUser);
router.get("/search", getUserSearch);
router.post("/update/:id", veryfyTocken, updateUser);
router.delete("/delete/:id", veryfyTocken, deleteUser);
router.get("/:id", veryfyTocken, getUser);

export default router;
