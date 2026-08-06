import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ✅ SIGNUP
export const Signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      type: "user", // safe fallback
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("axyres_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("axyres_user", "LoggedIn", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    user.password = undefined;

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Signup failed",
    });
  }
};



// ==========================
// LOGIN
// ==========================
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate Request
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find User
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Verify Password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // ==========================
    // AUTH COOKIE (HttpOnly)
    // ==========================
    res.cookie("axyres_token", token, {
  httpOnly: true,
  secure: false,          // localhost
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
});

    // ==========================
    // EXTENSION DETECTION COOKIE
    // ==========================
    res.cookie("axyres_user", "LoggedIn", {
  httpOnly: false,
  secure: false,          // localhost
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
});
  

    // Remove Password
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        email: user.email,
        type: user.type,
        hasResume: !!user.latestResume,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};


// ✅ LOGOUT (New Function)
export const Logout = async (req, res) => {
  try {
    // Evict the HTTP cookie by overwriting its expiration dates instantly
    res.clearCookie("axyres_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("axyres_user", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};

// ✅ GET ME
export const getMe = async (req, res) => {
  try {
    const token = req.cookies.axyres_token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};