import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["startup", "freelancer", "admin"],
      default: "freelancer"
    },
    skills: [{ type: String, trim: true }],
    languages: [{ type: String, trim: true }],
    timeZone: { type: String, default: "UTC" },
    industryExperience: [{ type: String, trim: true }],
    availabilityHoursPerWeek: { type: Number, default: 20 },
    portfolioLinks: [{ type: String }],
    fundingStage: { type: String, default: "bootstrapped" },
    verificationStatus: { type: Boolean, default: false },
    completedProjects: { type: Number, default: 0 },
    onTimeRate: { type: Number, default: 85 },
    averageRating: { type: Number, default: 4.5 },
    paymentSuccessRate: { type: Number, default: 90 },
    profileCompleteness: { type: Number, default: 70 }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
