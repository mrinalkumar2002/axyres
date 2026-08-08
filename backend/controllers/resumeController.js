import User from "../models/userModel.js";
import fs from "fs";
import path from "path";

export const saveLatestResume = async (req, res) => {
  try {
    const userId = req.user.id;
    let { templateId, resumeData } = req.body;

    // Handle stringified JSON from FormData or plain Object from JSON body
    if (typeof resumeData === "string") {
      try {
        resumeData = JSON.parse(resumeData);
      } catch (e) {
        console.error("Failed to parse resumeData string");
      }
    }

    let pdfUrl;
    if (req.file) {
      pdfUrl = `/uploads/${req.file.filename}`;
    }

    const updatePayload = {
      "latestResume.templateId": templateId || 1,
      "latestResume.resumeData": resumeData,
      "latestResume.source": req.file ? "uploaded" : "tailored",
      "latestResume.updatedAt": new Date()
    };
    
    // Preserve old pdfUrl if no new file is uploaded
    if (pdfUrl) {
      updatePayload["latestResume.pdfUrl"] = pdfUrl;
    }

    // 🔥 Atomic Overwrite (Single Database Operation)
    const oldUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updatePayload },
      { new: false } // Returns the old document before update
    );

    // 🔥 Delete old resume file ONLY if a NEW file was uploaded
    if (req.file && oldUser && oldUser.latestResume && oldUser.latestResume.pdfUrl) {
      const oldPath = path.join(
        process.cwd(),
        oldUser.latestResume.pdfUrl
      );

      fs.unlink(oldPath, (err) => {
        if (err) console.log("Old resume not found or already deleted");
      });
    }

    res.json({
      success: true,
      message: "Latest resume saved",
      pdfUrl: pdfUrl || (oldUser?.latestResume?.pdfUrl || null),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const getLatestResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user || !user.latestResume) {
      return res.json({ success: true, resume: null });
    }

    res.json({
      success: true,
      resume: user.latestResume,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
