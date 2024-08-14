import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
} from "../Controllers/User_Controller.js";
import auth from "../Middle_ware/Auth_middle_ware.js";

const user_router = express.Router();

// Register Route
user_router.post("/register", register);

// Login Route
user_router.post("/login", login);

// Logout Route
user_router.get("/logout", logout);

user_router.post("/update/user", auth, updateProfile);

export default user_router;
