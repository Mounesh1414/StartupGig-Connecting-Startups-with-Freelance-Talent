const clamp = (value) => Math.max(0, Math.min(100, value));

export const calculateStartupHealthScore = (startup) => {
  const fundingMap = {
    bootstrapped: 60,
    preseed: 70,
    seed: 80,
    series_a: 90
  };

  const score =
    startup.profileCompleteness * 0.3 +
    (fundingMap[startup.fundingStage] || 50) * 0.2 +
    startup.completedProjects * 2 +
    startup.paymentSuccessRate * 0.3 +
    (startup.verificationStatus ? 100 : 40) * 0.2;

  return clamp(Math.round(score / 2));
};

export const calculateFreelancerTrustScore = (freelancer) => {
  const score =
    freelancer.completedProjects * 6 +
    freelancer.averageRating * 15 +
    freelancer.onTimeRate * 0.5 +
    (freelancer.portfolioLinks?.length || 0) * 8 +
    (freelancer.verificationStatus ? 100 : 50) * 0.2;

  return clamp(Math.round(score / 2));
};
