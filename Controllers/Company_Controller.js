import Company from "../Models/Company_schema.js";

export const registerCompany = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if company name is provided
    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res
        .status(400)
        .json({ message: "You can't register same company" });
    }

    // Create new company
    const newCompany = new Company({
      name,
      userId: req.user.userId, // Assuming you have middleware to extract userId from the token
    });

    // Save company to database
    await newCompany.save();

    res.status(201).json({ message: "Company registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you have middleware to extract userId from the token

    // Find companies by userId
    const companies = await Company.find({ userId });

    // Check if any companies were found
    if (companies.length === 0) {
      return res
        .status(404)
        .json({ message: "No companies found for this user" });
    }

    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ... other functions (registerCompany, getCompany)

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.companyId; // Get companyId from request parameters
    // console.log(companyId);

    // Find the company by its ID
    const company = await Company.findById(companyId);

    // Check if a company with the given ID was found
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const { name, description, website, location } = req.body;
    const logoFile = req.files?.logo; // Get the logo file from req.files

    // Find the company by ID
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Handle logo upload if a new logo is provided
    if (logoFile) {
      // Upload the logo to Cloudinary
      const uploadedLogo = await uploadImageToCloudinary(
        logoFile.tempFilePath, // Assuming tempFilePath is available
        "company-logos" // Specify your Cloudinary folder
      );

      // Update the company's logo URL
      company.logo = uploadedLogo.secure_url;
    }

    // Update other company details
    company.name = name || company.name; // Update only if provided
    company.description = description || company.description;
    company.website = website || company.website;
    company.location = location || company.location;

    // Save the updated company
    await company.save();

    res.status(200).json({
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
