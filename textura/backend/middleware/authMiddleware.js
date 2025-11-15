import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from DB without password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Token failed" });
    }
  }

  res.status(401).json({ success: false, message: "Not authorized" });
};
