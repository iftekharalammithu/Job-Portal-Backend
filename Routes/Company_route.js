import express from "express";
import auth from "../Middle_ware/Auth_middle_ware.js";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../Controllers/Company_Controller.js";

const company_route = express.Router();

company_route.post("/register/company", auth, registerCompany);
company_route.get("/getcompany", auth, getCompany);
company_route.get("/companydetails/:companyId", auth, getCompanyById);
company_route.put("/updatecompany/:companyId", auth, updateCompany);

export default company_route;
