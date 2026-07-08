import Project from "../models/Project.js";
import Application from "../models/Application.js";

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, startup: req.user._id });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const listProjects = async (_req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).populate("startup", "name");
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate("startup", "name email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const getStartupDashboard = async (req, res, next) => {
  try {
    const projects = await Project.find({ startup: req.user._id }).sort({ createdAt: -1 });
    const projectIds = projects.map((p) => p._id);
    const applicants = await Application.countDocuments({ project: { $in: projectIds } });

    res.json({
      activeProjects: projects.filter((p) => p.status === "open").length,
      totalApplicants: applicants,
      budgetTracking: projects.reduce((sum, p) => sum + p.budgetMax, 0),
      hiringProgress: projects.length
        ? Math.round((projects.filter((p) => p.status !== "open").length / projects.length) * 100)
        : 0,
      projects
    });
  } catch (error) {
    next(error);
  }
};
