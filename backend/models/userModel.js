import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  templateId: Number,
  resumeData: Object,
  pdfUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, default: "free user" },

  latestResume: {
    templateId: Number,
    resumeData: Object,
    pdfUrl: String,
    atsScore: Number,
    lastTailoredAt: Date,
    createdAt: Date
}// only one resume
});

export default mongoose.model("User", userSchema);
;

