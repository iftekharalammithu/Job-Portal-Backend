import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./Utils/Mongodb.js";
import user_router from "./Routes/User_route.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "https://your-frontend-domain.com", // Replace with your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credential: true,
  })
);
app.use("/api/v1/user", user_router);

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

// Start the server
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
