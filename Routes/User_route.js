import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
} from "../Controllers/User_Controller.js";
import auth from "../Middle_ware/Auth_middle_ware.js";

const router = express.Router();

// Register Route
router.post("/register", register);

// Login Route
router.post("/login", login);

// Logout Route
router.post("/logout", auth, logout);

router.post("/updateuser", auth, updateProfile);

export default router;
