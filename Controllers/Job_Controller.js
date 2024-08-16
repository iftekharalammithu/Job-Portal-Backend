import Job from "../Models/Job_schema.js";

// For Admin Post
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience, // Assuming "experience" is the same as "position"
      position,
      companyId,
    } = req.body;

    // Check if any required field is missing
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !position ||
      !experience ||
      !companyId
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Create new job object
    const newJob = new Job({
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : [requirements], // Ensure requirements is an array
      salary,
      location,
      jobType,
      position,
      experience, // Use experience if provided, otherwise use position
      company: companyId,
      createdBy: req.user.userId, // Assuming you have middleware to extract userId from the token
    });

    // Save job to database
    await newJob.save();

    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ... other functions (postJob)
// For Student
export const getAllJobs = async (req, res) => {
  try {
    const { keyword } = req.query;

    // Create a query object for MongoDB
    const query = {};

    // Add keyword search to the query if provided
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } }, // Case-insensitive title search
        { description: { $regex: keyword, $options: "i" } }, // Case-insensitive description search
      ];
    }

    // Find jobs based on the query
    const jobs = await Job.find(query);
    //   .populate("company", "name logo description") // Populate company details
    //   .sort({ createdAt: -1 }); // Sort by creation date (newest first)

    if (!jobs) {
      return res
        .status(400)
        .json({ message: "Jobs Not Found", success: false });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ... other functions (postJob, getAllJobs)
// For Student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.jobId; // Get jobId from request parameters

    // Find the job by its ID and populate company details
    const job = await Job.findById(jobId);
    // .populate(
    //   "company",
    //   "name logo description"
    // );

    // Check if a job with the given ID was found
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
