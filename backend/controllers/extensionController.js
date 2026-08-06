import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * Generate an Extension Token
 * This endpoint can only be called if the user
 * is already logged into the website.
 */


export const generateExtensionToken = async (req, res) => {
  try {
    // User already authenticated by authMiddleware
    const user = req.user;

    const extensionToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        source: "extension",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      token: extensionToken,
      user: {
        id: user._id,
        email: user.email,
        type: user.type,
      },
    });

  } catch (error) {
    console.error("Extension Token Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate extension token.",
    });
  }
};

/**
 * Check Extension Status
 */
export const extensionStatus = async (req, res) => {
  try {

    const user = req.user;

    const resumeExists =
      !!user.latestResume &&
      !!user.latestResume.resumeData;

    return res.status(200).json({
      success: true,
      loggedIn: true,
      resumeExists,

      user: {
        id: user._id,
        email: user.email,
        type: user.type,
      },
    });

  } catch (error) {

    console.error("Extension Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

export const checkResume = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      success: true,
      resumeExists: !!user.latestResume?.resumeData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to check resume.",
    });
  }
};