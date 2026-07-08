import { getSmartMatchBreakdown } from "./MatchingService.js";

const SKILLS = [
  "react",
  "node",
  "mongodb",
  "figma",
  "typescript",
  "python",
  "qa",
  "devops",
  "aws",
  "ui/ux"
];

const INDUSTRIES = ["saas", "fintech", "healthtech", "edtech", "marketplace", "ai", "ecommerce"];

const unique = (items = []) => [...new Set(items.filter(Boolean))];

const textIncludesAny = (text, options = []) => options.some((option) => text.includes(option));

export const analyzeProjectRequirements = (description = "") => {
  const normalized = description.toLowerCase();
  const requiredSkills = unique([
    ...SKILLS.filter((skill) => normalized.includes(skill)),
    ...(textIncludesAny(normalized, ["frontend", "front-end", "ui"]) ? ["react", "typescript"] : []),
    ...(textIncludesAny(normalized, ["backend", "api", "server"]) ? ["node", "mongodb"] : []),
    ...(textIncludesAny(normalized, ["deploy", "infra", "ci/cd", "devops"]) ? ["devops", "aws"] : [])
  ]);

  const timelineWeeks = normalized.includes("urgent") ? 2 : normalized.includes("mvp") ? 6 : 4;
  const estimatedBudget =
    normalized.includes("senior") || normalized.includes("architect") ? 5000 : requiredSkills.length > 5 ? 3500 : 2200;
  const teamSize = requiredSkills.length > 6 ? 5 : requiredSkills.length > 3 ? 3 : 2;
  const experienceLevel = normalized.includes("senior") || normalized.includes("lead") ? "Senior" : "Mid";

  const complexityScore = Math.min(
    100,
    requiredSkills.length * 11 +
      (normalized.includes("integration") ? 12 : 0) +
      (normalized.includes("real-time") ? 15 : 0) +
      (normalized.includes("scalable") ? 10 : 0)
  );

  const riskLevel = complexityScore >= 75 || timelineWeeks <= 2 ? "High" : complexityScore >= 55 ? "Medium" : "Low";
  const recommendedModel = timelineWeeks <= 2 ? "Sprint squad" : teamSize >= 4 ? "Pod model" : "Core duo";

  const milestones = [
    `Week 1: Discovery, architecture and delivery plan`,
    `Week ${Math.max(2, Math.ceil(timelineWeeks * 0.5))}: MVP milestone with stakeholder demo`,
    `Week ${timelineWeeks}: Production readiness and handoff`
  ];

  const suggestedIndustry = INDUSTRIES.find((industry) => normalized.includes(industry)) || "saas";

  return {
    requiredSkills,
    estimatedBudget,
    timelineWeeks,
    suggestedTeamSize: teamSize,
    experienceLevel,
    complexityScore,
    riskLevel,
    recommendedModel,
    milestones,
    suggestedIndustry
  };
};

export const analyzeResumeText = (resumeText = "") => {
  const normalized = resumeText.toLowerCase();
  const detectedSkills = SKILLS.filter((skill) => normalized.includes(skill));
  const missingCoreSkills = ["communication", "problem solving", "git"].filter(
    (skill) => !normalized.includes(skill)
  );

  return {
    extractedSkills: detectedSkills,
    missingSkills: missingCoreSkills,
    profileStrength: Math.min(100, detectedSkills.length * 11 + (normalized.includes("startup") ? 20 : 0)),
    marketPositioning:
      detectedSkills.length >= 6
        ? "Specialist builder for startup MVPs"
        : "Generalist contributor with growth potential",
    suggestions: [
      "Add quantified project outcomes to each experience entry.",
      "Include stack details for each portfolio project.",
      "Highlight startup or fast-paced team experience.",
      "Pin your strongest two capabilities in the first 3 lines of your profile."
    ],
    generatedProfileSummary:
      "Practical freelancer with hands-on product delivery experience, collaborative communication style, and startup execution focus."
  };
};

export const buildTeamSuggestion = (requiredSkills = []) => {
  const normalized = requiredSkills.map((skill) => skill.toLowerCase());
  const team = [];

  if (normalized.some((s) => ["ui/ux", "figma", "design"].includes(s))) {
    team.push({ role: "UI/UX Designer", focus: "interaction flows and visual consistency" });
  }
  if (normalized.some((s) => ["react", "frontend", "typescript"].includes(s))) {
    team.push({ role: "React Developer", focus: "frontend architecture and component system" });
  }
  if (normalized.some((s) => ["node", "backend", "mongodb", "aws"].includes(s))) {
    team.push({ role: "Node.js Developer", focus: "APIs, data modeling, and deployment" });
  }
  if (normalized.some((s) => ["qa", "testing"].includes(s))) {
    team.push({ role: "QA Engineer", focus: "automation coverage and release confidence" });
  }

  if (!team.length) {
    team.push({ role: "Full Stack Developer", focus: "end-to-end MVP delivery" });
  }

  return {
    team,
    collaborationModel: team.length >= 4 ? "Pod model" : "Lean squad",
    weeklyCeremony: "Two syncs + async standup + Friday demo"
  };
};

export const analyzeSkillGap = (projectSkills = [], freelancerSkills = []) => {
  const freelancerSet = new Set(freelancerSkills.map((skill) => skill.toLowerCase()));
  const missing = projectSkills.filter((skill) => !freelancerSet.has(skill.toLowerCase()));

  const prioritized = missing.map((skill, index) => ({
    skill,
    priority: index < 2 ? "High" : "Medium",
    effortWeeks: index < 2 ? 2 : 1
  }));

  return {
    missingSkills: missing,
    prioritizedGaps: prioritized,
    recommendedLearningPath: missing.map((skill) => `Build one production-ready project using ${skill}.`),
    sprintRoadmap: [
      "30 days: close first high-priority skill gap with one mini-project",
      "60 days: add one real-world portfolio case study",
      "90 days: complete a startup-style capstone and publish outcomes"
    ]
  };
};

export const generateProposal = ({ freelancerName, projectTitle, projectDescription, highlights }) => {
  const valueLine = highlights?.length
    ? highlights[0]
    : "Fast and reliable startup-focused execution";

  return `Hi, I am ${freelancerName}. I am excited to support ${projectTitle}.

Based on your project details: ${projectDescription}

What differentiates my approach: ${valueLine}

Here is how I can help:
${highlights.map((h, i) => `${i + 1}. ${h}`).join("\n")}

I can start immediately, communicate proactively, and deliver with startup speed and quality.

If helpful, I can also provide a 7-day execution plan before kickoff.`;
};

export const getSmartMatch = ({ project, freelancer, proposedBudget }) =>
  getSmartMatchBreakdown({ project, freelancer, proposedBudget });
