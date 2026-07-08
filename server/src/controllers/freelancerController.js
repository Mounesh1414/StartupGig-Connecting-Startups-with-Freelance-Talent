import User from "../models/User.js";
import { calculateFreelancerTrustScore } from "../utils/trustScore.js";

export const listFreelancers = async (_req, res, next) => {
  try {
    const freelancers = await User.find({ role: "freelancer" }).select("-password").sort({ createdAt: -1 });
    const data = freelancers.map((freelancer) => ({
      ...freelancer.toObject(),
      trustScore: calculateFreelancerTrustScore(freelancer)
    }));
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const freelancerDashboard = async (req, res, next) => {
  try {
    const freelancer = await User.findById(req.user._id).select("-password");
    const trustScore = calculateFreelancerTrustScore(freelancer);
    const profileStrength = Math.min(
      100,
      freelancer.profileCompleteness + (freelancer.portfolioLinks?.length || 0) * 10
    );

    res.json({
      trustScore,
      profileStrength,
      earnings: freelancer.completedProjects * 700,
      skillGrowth: Math.min(100, freelancer.completedProjects * 8),
      recommendedJobs: Math.max(1, freelancer.skills.length)
    });
  } catch (error) {
    next(error);
  }
};
