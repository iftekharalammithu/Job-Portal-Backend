import Application from "../Models/Application_schema.js";
import Job_schema from "../Models/Job_schema.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = req.params.jobId;

    // Check if the application already exists
    const existingApplication = await Application.findOne({
      applicant: userId,
      job: jobId,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    // Check if the job exists
    const job = await Job_schema.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Create a new application
    const newApplication = new Application({
      job: jobId,
      applicant: userId,
    });

    // Save the application
    await newApplication.save();

    // Add the application to the job's applications array
    job.applications.push(newApplication._id);
    await job.save();

    res.status(201).json({ message: "Job application submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
