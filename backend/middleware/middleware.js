import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {

  console.log("Cookie Token:", req.cookies?.axyres_token);
console.log("Authorization:", req.headers.authorization);
console.log("Cookies:", req.cookies);
  try {
    // Website cookie
    const cookieToken = req.cookies?.axyres_token;

    // Extension / Postman Bearer token
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

  

    // Accept either
    const token = cookieToken || bearerToken;



    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("Auth Error:", err);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};