import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    proposedBudget: { type: Number, required: true },
    coverLetter: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "hired", "rejected"],
      default: "pending"
    },
    aiMatchScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

applicationSchema.index({ project: 1, freelancer: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
