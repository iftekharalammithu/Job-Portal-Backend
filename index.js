import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./Utils/Mongodb.js";
import user_router from "./Routes/User_route.js";
import company_route from "./Routes/Company_route.js";
import job_route from "./Routes/Job_Route.js";
import Application_router from "./Routes/Application_Route.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credential: true,
  })
);
app.use("/api/v1/user", user_router);
app.use("/api/v1/company", company_route);
app.use("/api/v1/job", job_route);
app.use("/api/v1/application", Application_router);

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

// Start the server
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
