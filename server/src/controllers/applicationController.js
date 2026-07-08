import Application from "../models/Application.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { getSmartMatch } from "../services/AIService.js";

export const applyToProject = async (req, res, next) => {
  try {
    const { projectId, proposedBudget, coverLetter } = req.body;
    const [project, freelancer] = await Promise.all([
      Project.findById(projectId),
      User.findById(req.user._id)
    ]);

    if (!project) return res.status(404).json({ message: "Project not found" });

    const matchBreakdown = getSmartMatch({ project, freelancer, proposedBudget });

    const application = await Application.create({
      project: projectId,
      freelancer: req.user._id,
      proposedBudget,
      coverLetter,
      aiMatchScore: matchBreakdown.overallMatch
    });

    return res.status(201).json({ application, matchBreakdown });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You already applied to this project" });
    }
    return next(error);
  }
};

export const myApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ freelancer: req.user._id })
      .populate("project", "title budgetMax status")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    next(error);
  }
};
