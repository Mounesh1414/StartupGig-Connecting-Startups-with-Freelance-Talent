const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const overlapRatio = (a = [], b = []) => {
  if (!a.length || !b.length) return 0;
  const setA = new Set(a.map((v) => v.toLowerCase()));
  const setB = new Set(b.map((v) => v.toLowerCase()));
  let overlap = 0;
  for (const item of setA) {
    if (setB.has(item)) overlap += 1;
  }
  return overlap / Math.max(setA.size, 1);
};

const normalize = (items = []) => items.map((item) => String(item).trim().toLowerCase()).filter(Boolean);

const computeExecutionVelocity = (freelancer, project) => {
  const availability = clamp((freelancer.availabilityHoursPerWeek / 40) * 100, 0, 100);
  const timelinePressure = project.timelineWeeks <= 2 ? 100 : project.timelineWeeks <= 4 ? 85 : 70;
  const onTime = clamp(freelancer.onTimeRate || 0, 0, 100);
  return clamp(availability * 0.45 + onTime * 0.35 + timelinePressure * 0.2, 0, 100);
};

const computeCommunicationFit = (freelancer, project) => {
  const languages = normalize(freelancer.languages);
  const languageMatch = languages.includes(String(project.communicationLanguage || "").toLowerCase()) ? 100 : 55;
  const asyncCulture = clamp((freelancer.profileCompleteness || 60) * 0.6 + (freelancer.onTimeRate || 70) * 0.4, 0, 100);
  return clamp(languageMatch * 0.6 + asyncCulture * 0.4, 0, 100);
};

const getRiskRadar = ({ budgetScore, availabilityScore, communicationFit, industryScore }) => {
  const items = [];

  if (budgetScore < 65) items.push("Budget alignment risk: delivery scope may need phasing.");
  if (availabilityScore < 60) items.push("Capacity risk: freelancer may need schedule reshaping for timelines.");
  if (communicationFit < 70) items.push("Collaboration risk: align language and communication cadence early.");
  if (industryScore < 45) items.push("Domain risk: include startup onboarding and product context handoff.");

  const riskLevel = items.length >= 3 ? "High" : items.length === 2 ? "Medium" : "Low";
  return { riskLevel, riskFlags: items };
};

const getMatchRecommendations = ({ overall, skillScore, executionVelocity, riskLevel }) => {
  const recommendations = [];

  if (skillScore < 70) {
    recommendations.push("Start with a paid technical trial focused on core project skills.");
  }
  if (executionVelocity < 70) {
    recommendations.push("Split delivery into weekly milestones with explicit acceptance criteria.");
  }
  if (riskLevel !== "Low") {
    recommendations.push("Run a kickoff workshop to align scope, sprint cadence, and communication norms.");
  }
  if (overall >= 85) {
    recommendations.push("Fast-track hiring and lock sprint planning within 48 hours.");
  }

  if (!recommendations.length) {
    recommendations.push("Proceed with standard onboarding and monitor weekly delivery signals.");
  }

  return recommendations;
};

export const getSmartMatchBreakdown = ({ project, freelancer, proposedBudget }) => {
  const skillScore = overlapRatio(project.requiredSkills, freelancer.skills) * 100;
  const industryScore = overlapRatio([project.industry], freelancer.industryExperience) * 100;
  const availabilityScore = clamp((freelancer.availabilityHoursPerWeek / 40) * 100, 0, 100);
  const timeZoneScore = project.preferredTimeZone === freelancer.timeZone ? 100 : 80;
  const languageScore = freelancer.languages?.includes(project.communicationLanguage) ? 100 : 70;
  const executionVelocity = computeExecutionVelocity(freelancer, project);
  const communicationFit = computeCommunicationFit(freelancer, project);

  const budgetDistance = Math.abs((proposedBudget || project.budgetMax) - project.budgetMax);
  const budgetScore = clamp(100 - (budgetDistance / Math.max(project.budgetMax, 1)) * 100, 0, 100);

  const portfolioScore = clamp((freelancer.portfolioLinks?.length || 0) * 20, 0, 100);
  const experienceScore = clamp(freelancer.completedProjects * 8, 0, 100);

  const overall =
    skillScore * 0.24 +
    experienceScore * 0.13 +
    portfolioScore * 0.08 +
    budgetScore * 0.13 +
    timeZoneScore * 0.06 +
    availabilityScore * 0.1 +
    languageScore * 0.06 +
    industryScore * 0.06 +
    executionVelocity * 0.08 +
    communicationFit * 0.06;

  const clampedOverall = Number(clamp(overall, 0, 100).toFixed(0));
  const confidence = Number(
    clamp(
      45 +
        (skillScore > 60 ? 15 : 5) +
        (portfolioScore > 50 ? 10 : 0) +
        (industryScore > 40 ? 10 : 0) +
        (experienceScore > 50 ? 12 : 6),
      40,
      98
    ).toFixed(0)
  );

  const { riskLevel, riskFlags } = getRiskRadar({
    budgetScore,
    availabilityScore,
    communicationFit,
    industryScore
  });

  const recommendations = getMatchRecommendations({
    overall: clampedOverall,
    skillScore,
    executionVelocity,
    riskLevel
  });

  const hiringLane = clampedOverall >= 88 ? "Immediate" : clampedOverall >= 74 ? "Priority" : "Explore";

  return {
    frontendSkills: Number(skillScore.toFixed(0)),
    reactExperience: Number(experienceScore.toFixed(0)),
    budgetMatch: Number(budgetScore.toFixed(0)),
    availability: Number(availabilityScore.toFixed(0)),
    overallMatch: clampedOverall,
    executionVelocity: Number(executionVelocity.toFixed(0)),
    communicationFit: Number(communicationFit.toFixed(0)),
    confidence,
    hiringLane,
    riskLevel,
    riskFlags,
    recommendations,
    explainability: {
      strongestSignals: [
        { label: "Skills overlap", score: Number(skillScore.toFixed(0)) },
        { label: "Execution velocity", score: Number(executionVelocity.toFixed(0)) },
        { label: "Budget alignment", score: Number(budgetScore.toFixed(0)) }
      ].sort((a, b) => b.score - a.score),
      weakestSignals: [
        { label: "Industry context", score: Number(industryScore.toFixed(0)) },
        { label: "Communication fit", score: Number(communicationFit.toFixed(0)) },
        { label: "Availability", score: Number(availabilityScore.toFixed(0)) }
      ].sort((a, b) => a.score - b.score)
    }
  };
};
