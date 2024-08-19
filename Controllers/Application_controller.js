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

// ... other functions (applyJob)

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you have middleware to extract userId from the token

    // Find applications where the applicant matches the userId
    const applications = await Application.find({ applicant: userId })
      .populate({
        path: "job", // Populate the job field

        populate: {
          path: "company", // Populate the company field within the job
          select: "name logo description", // Select specific fields from the company
        },
      })
      .sort({ "job.createdAt": -1 });

    if (!applications) {
      return res.status(404).json({ message: "No applications found" });
    }

    res.status(200).json({ applications, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ... other functions (applyJob, getAppliedJobs)

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Find the job by its ID and populate applications with applicant details
    const job = await Job_schema.findById(jobId).populate({
      path: "applications", // Populate the applications array
      populate: {
        path: "applicant", // Populate the applicant field within each application
        select: "fullname email phonenumber profile", // Select specific fields from the applicant
      },
      options: { sort: { createdAt: -1 } },
    });
    // .sort({ "job.createdAt": 1 });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Sort applications by application date (newest first)

    res.status(200).json({ applicants: job.applications, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ... other functions (applyJob, getAppliedJobs, getApplicants)

export const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const { status } = req.body;

    // Check if status is provided
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Check if status is valid
    const validStatuses = ["Pending", "Accepted", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status value", validStatuses });
    }

    // Find the application by ID
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update the application status
    application.status = status;

    // Save the updated application
    await application.save();

    res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
