import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    // Get the token from the request cookies
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user ID and role to the request object
    req.user = {
      userId: decodedToken.userId,
      role: decodedToken.role,
    };

    // Move on to the next middleware/route handler
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    console.error(error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default auth;
