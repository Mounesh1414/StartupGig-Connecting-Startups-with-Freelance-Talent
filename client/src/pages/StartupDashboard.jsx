import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  BarElement,
  Tooltip
} from "chart.js";
import StatCard from "../components/StatCard";
import { aiAPI, projectAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const StartupDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [healthScore, setHealthScore] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [teamPlan, setTeamPlan] = useState(null);
  const [description, setDescription] = useState("Need an urgent MVP with React, Node, MongoDB and QA automation.");

  useEffect(() => {
    projectAPI.startupDashboard().then(setDashboard).catch(() => setDashboard(null));
    if (user?._id) {
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/ai/startup-health/${user._id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("startupgig_token")}` } })
        .then((res) => res.json())
        .then((data) => setHealthScore(data.score || 0))
        .catch(() => setHealthScore(0));
    }
  }, [user?._id]);

  const runAnalyzer = async () => {
    const result = await aiAPI.analyzeProject(description);
    setAnalysis(result);
    const team = await aiAPI.teamBuilder(result.requiredSkills || []);
    setTeamPlan(team);
  };

  if (!dashboard) return <p>Loading dashboard...</p>;

  return (
    <section>
      <h1>Startup Dashboard</h1>
      <div className="stats-grid">
        <StatCard label="Active Projects" value={dashboard.activeProjects} />
        <StatCard label="Total Applicants" value={dashboard.totalApplicants} />
        <StatCard label="Budget Tracking" value={`$${dashboard.budgetTracking}`} />
        <StatCard label="Hiring Progress" value={`${dashboard.hiringProgress}%`} />
        <StatCard label="Startup Health Score" value={healthScore ?? "-"} />
      </div>

      <article className="panel">
        <h2>Budget Overview</h2>
        <Bar
          data={{
            labels: dashboard.projects.map((p) => p.title),
            datasets: [
              {
                label: "Project Budget",
                data: dashboard.projects.map((p) => p.budgetMax),
                backgroundColor: "rgba(242, 109, 48, 0.72)"
              }
            ]
          }}
        />
      </article>

      <article className="panel">
        <h2>AI Project Requirement Analyzer</h2>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        <button className="btn-primary" onClick={runAnalyzer}>
          Analyze Requirements
        </button>
        {analysis && (
          <div className="result-box">
            <p>Required Skills: {analysis.requiredSkills.join(", ") || "None detected"}</p>
            <p>Estimated Budget: ${analysis.estimatedBudget}</p>
            <p>Timeline: {analysis.timelineWeeks} weeks</p>
            <p>Suggested Team Size: {analysis.suggestedTeamSize}</p>
            <p>Experience Level: {analysis.experienceLevel}</p>
            <p>Complexity Score: {analysis.complexityScore}/100</p>
            <p>Risk Level: {analysis.riskLevel}</p>
            <p>Delivery Model: {analysis.recommendedModel}</p>
            <p>Suggested Industry: {analysis.suggestedIndustry}</p>
            <strong>Milestones</strong>
            {analysis.milestones.map((milestone) => (
              <p key={milestone}>- {milestone}</p>
            ))}
          </div>
        )}

        {teamPlan && (
          <div className="result-box">
            <strong>AI Team Builder</strong>
            {teamPlan.team.map((member) => (
              <p key={member.role}>
                {member.role}: {member.focus}
              </p>
            ))}
            <p>Collaboration Model: {teamPlan.collaborationModel}</p>
            <p>Weekly Ritual: {teamPlan.weeklyCeremony}</p>
          </div>
        )}
      </article>
    </section>
  );
};

export default StartupDashboard;
