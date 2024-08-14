import Company from "../Models/Company_schema.js";

export const registerCompany = async (req, res) => {
  try {
    const { name, description, website, location, logo } = req.body;
    const userId = req.user.userId; // Assuming you have middleware to extract userId from the token

    // Check if any required field is missing
    if (!name || !description || !website || !location || !logo) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Create a new company
    const newCompany = new Company({
      name,
      description,
      website,
      location,
      logo,
      userId, // Associate the company with the logged-in user
    });

    // Save the company to the database
    await newCompany.save();

    res.status(201).json({
      message: "Company registered successfully",
      company: newCompany,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
