import User from "../Models/User_model_Schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { fullname, email, phonenumber, password, role } = req.body;

    // Check if any required field is missing
    if (!fullname || !email || !phonenumber || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullname,
      email,
      phonenumber,
      password: hashedPassword,
      role, // Make sure to include the role in the request body
    });

    // Save user to database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if email and password are provided
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All Field are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (role !== user.role) {
      return res
        .status(401)
        .json({ message: "Account Doen't Exist With Current Role" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d", // Token expires in 1 day
      }
    );

    // Set token in a cookie (optional, but common for web apps)
    res.cookie("token", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expires in 30 days
      httpOnly: true, // Prevent client-side access to the cookie
      sameSite: "None", // Prevent CSRF attacks
      secure: false, // Cookie expires in 1 hour (same as token)
    });

    res.status(200).json({
      message: "Login successful",
      user_data: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phonenumber,
        role: user.role,
      },
      token, // Include token in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ... (existing register and login functions)

export const logout = async (req, res) => {
  try {
    // Clear the cookie that holds the JWT token
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you have middleware to extract userId from the token
    // console.log(userId);
    const {
      fullname,
      email,
      phonenumber,
      bio,
      skills,
      resume,
      resumeOriginalName,
      profilePhoto,
    } = req.body;

    // the skills code is in 1:13:20 time YT Videos

    // Create an update object with only the fields to be updated
    const updateFields = {};
    if (fullname) updateFields.fullname = fullname;
    if (email) updateFields.email = email;
    if (phonenumber) updateFields.phonenumber = phonenumber;
    if (bio) updateFields["profile.bio"] = bio; // Update nested field
    if (skills) updateFields["profile.skills"] = skills; // Update nested field
    if (resume) updateFields["profile.resume"] = resume; // Update nested field
    if (resumeOriginalName)
      updateFields["profile.resumeOriginalName"] = resumeOriginalName; // Update nested field
    if (profilePhoto) updateFields["profile.profilePhoto"] = profilePhoto; // Update nested field

    // Find the user by ID and update the profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields }, // Use $set to update only specified fields
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user_data: {
        _id: updatedUser._id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        phone: updatedUser.phonenumber,
        role: updatedUser.role,
        profile: updatedUser.profile,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
