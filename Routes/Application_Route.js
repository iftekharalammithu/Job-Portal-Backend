import express from "express";
import {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateApplicationStatus,
} from "../Controllers/Application_controller.js";
import auth from "../Middle_ware/Auth_middle_ware.js";

const Application_router = express.Router();

// Apply for a job
Application_router.post("/applyJob/:jobId", auth, applyJob);

// Get applied jobs for a user
Application_router.get("/applications/applied", auth, getAppliedJobs);

// Get applicants for a job (for recruiters/admins)
Application_router.get("/jobs/:jobId", auth, getApplicants);

// Update application status (for recruiters/admins)
Application_router.put(
  "/applications/:applicationId",
  auth,
  updateApplicationStatus
);

export default Application_router;
