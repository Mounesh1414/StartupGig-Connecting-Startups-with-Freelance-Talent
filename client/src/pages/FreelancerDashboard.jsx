import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { aiAPI, freelancerAPI } from "../services/api";

const FreelancerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [resumeText, setResumeText] = useState("React Node MongoDB startup communication git leadership");
  const [resumeResult, setResumeResult] = useState(null);
  const [gapResult, setGapResult] = useState(null);

  useEffect(() => {
    freelancerAPI.dashboard().then(setDashboard).catch(() => setDashboard(null));
  }, []);

  const runResumeAnalyzer = async () => {
    const result = await aiAPI.resumeAnalyze(resumeText);
    setResumeResult(result);
  };

  const runGapAnalysis = async () => {
    const result = await aiAPI.skillGap(
      ["react", "node", "mongodb", "qa"],
      resumeResult?.extractedSkills || []
    );
    setGapResult(result);
  };

  if (!dashboard) return <p>Loading dashboard...</p>;

  return (
    <section>
      <h1>Freelancer Dashboard</h1>
      <div className="stats-grid">
        <StatCard label="Trust Score" value={dashboard.trustScore} />
        <StatCard label="Profile Strength" value={`${dashboard.profileStrength}%`} />
        <StatCard label="Earnings" value={`$${dashboard.earnings}`} />
        <StatCard label="Skill Growth" value={`${dashboard.skillGrowth}%`} />
        <StatCard label="Recommended Jobs" value={dashboard.recommendedJobs} />
      </div>

      <article className="panel">
        <h2>AI Resume Analyzer</h2>
        <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={4} />
        <div className="button-row">
          <button className="btn-primary" onClick={runResumeAnalyzer}>
            Analyze Resume
          </button>
          <button className="btn-outline" onClick={runGapAnalysis}>
            Run Skill Gap Analysis
          </button>
        </div>

        {resumeResult && (
          <div className="result-box">
            <p>Extracted Skills: {resumeResult.extractedSkills.join(", ") || "None"}</p>
            <p>Missing Skills: {resumeResult.missingSkills.join(", ") || "None"}</p>
            <p>Profile Strength: {resumeResult.profileStrength || 0}/100</p>
            <p>Market Positioning: {resumeResult.marketPositioning}</p>
            <p>Generated Profile: {resumeResult.generatedProfileSummary}</p>
            <strong>Profile Suggestions</strong>
            {resumeResult.suggestions.map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        )}

        {gapResult && (
          <div className="result-box">
            <p>Skill Gaps: {gapResult.missingSkills.join(", ") || "No gaps"}</p>
            {!!gapResult.prioritizedGaps?.length && <strong>Priority Gaps</strong>}
            {gapResult.prioritizedGaps?.map((gap) => (
              <p key={gap.skill}>
                {gap.skill}: {gap.priority} priority ({gap.effortWeeks} week target)
              </p>
            ))}
            {gapResult.recommendedLearningPath.map((step) => (
              <p key={step}>- {step}</p>
            ))}
            <strong>90-Day Roadmap</strong>
            {gapResult.sprintRoadmap.map((step) => (
              <p key={step}>- {step}</p>
            ))}
          </div>
        )}
      </article>
    </section>
  );
};

export default FreelancerDashboard;
