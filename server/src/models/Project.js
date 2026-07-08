import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    startup: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String, trim: true }],
    budgetMin: { type: Number, default: 0 },
    budgetMax: { type: Number, required: true },
    timelineWeeks: { type: Number, default: 4 },
    preferredTimeZone: { type: String, default: "UTC" },
    communicationLanguage: { type: String, default: "English" },
    industry: { type: String, default: "SaaS" },
    teamSizeSuggestion: { type: Number, default: 1 },
    status: { type: String, enum: ["open", "in_progress", "closed"], default: "open" }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
