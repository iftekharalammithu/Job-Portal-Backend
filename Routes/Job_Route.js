import express from "express";
import {
  getAllJobs,
  getJobByAdminId,
  getJobById,
  postJob,
} from "../Controllers/Job_Controller.js";
import auth from "../Middle_ware/Auth_middle_ware.js";

const job_route = express.Router();

job_route.post("/post_job", auth, postJob);
job_route.get("/getalljob", auth, getAllJobs);
job_route.post("/getJobById/:jobId", auth, getJobById);
job_route.post("/getJobByAdminId", auth, getJobByAdminId);

export default job_route;
