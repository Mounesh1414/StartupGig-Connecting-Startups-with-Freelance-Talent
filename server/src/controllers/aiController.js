import User from "../models/User.js";
import Project from "../models/Project.js";
import {
  analyzeProjectRequirements,
  analyzeResumeText,
  buildTeamSuggestion,
  analyzeSkillGap,
  generateProposal,
  getSmartMatch
} from "../services/AIService.js";
import { calculateStartupHealthScore, calculateFreelancerTrustScore } from "../utils/trustScore.js";

export const smartMatch = async (req, res, next) => {
  try {
    const { projectId, freelancerId, proposedBudget } = req.body;
    const [project, freelancer] = await Promise.all([
      Project.findById(projectId),
      User.findById(freelancerId)
    ]);

    if (!project || !freelancer) {
      return res.status(404).json({ message: "Project or freelancer not found" });
    }

    return res.json(getSmartMatch({ project, freelancer, proposedBudget }));
  } catch (error) {
    return next(error);
  }
};

export const startupHealthScore = async (req, res, next) => {
  try {
    const startup = await User.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: "Startup not found" });
    return res.json({ score: calculateStartupHealthScore(startup) });
  } catch (error) {
    return next(error);
  }
};

export const freelancerTrustScore = async (req, res, next) => {
  try {
    const freelancer = await User.findById(req.params.id);
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });
    return res.json({ score: calculateFreelancerTrustScore(freelancer) });
  } catch (error) {
    return next(error);
  }
};

export const projectAnalyzer = (req, res) => {
  const { description } = req.body;
  return res.json(analyzeProjectRequirements(description));
};

export const resumeAnalyzer = (req, res) => {
  const { resumeText } = req.body;
  return res.json(analyzeResumeText(resumeText));
};

export const teamBuilder = (req, res) => {
  const { requiredSkills = [] } = req.body;
  return res.json(buildTeamSuggestion(requiredSkills));
};

export const skillGap = (req, res) => {
  const { projectSkills = [], freelancerSkills = [] } = req.body;
  return res.json(analyzeSkillGap(projectSkills, freelancerSkills));
};

export const proposalGenerator = (req, res) => {
  const { freelancerName, projectTitle, projectDescription, highlights = [] } = req.body;
  return res.json({ proposal: generateProposal({ freelancerName, projectTitle, projectDescription, highlights }) });
};
