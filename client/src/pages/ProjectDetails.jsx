import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { aiAPI, applicationAPI, projectAPI } from "../services/api";
import MatchScoreCard from "../components/MatchScoreCard";
import { useAuth } from "../hooks/useAuth";

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [proposal, setProposal] = useState("");

  useEffect(() => {
    projectAPI.details(id).then(setProject);
  }, [id]);

  const apply = async () => {
    const result = await applicationAPI.apply({
      projectId: id,
      proposedBudget: project.budgetMax,
      coverLetter: "I can deliver a clean MVP fast and iterate with your team."
    });
    setMatchScore(result.matchBreakdown);

    const proposalData = await aiAPI.proposal({
      freelancerName: user.name,
      projectTitle: project.title,
      projectDescription: project.description,
      highlights: [
        "Strong startup delivery pace",
        "Clear async communication",
        "Production-ready code and docs"
      ]
    });

    setProposal(proposalData.proposal);
  };

  if (!project) return <p>Loading project...</p>;

  return (
    <section className="grid-2">
      <article className="panel">
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <p>
          Budget: ${project.budgetMin} - ${project.budgetMax}
        </p>
        <p>Timeline: {project.timelineWeeks} weeks</p>
        <div className="pill-row">
          {project.requiredSkills.map((skill) => (
            <span key={skill} className="pill">
              {skill}
            </span>
          ))}
        </div>
        {user?.role === "freelancer" && (
          <button className="btn-primary" onClick={apply}>
            Apply with AI Proposal
          </button>
        )}
      </article>

      <div>
        <MatchScoreCard score={matchScore} />
        {!!matchScore?.explainability && (
          <article className="panel">
            <h2>Why This Score</h2>
            <strong>Strongest Signals</strong>
            {matchScore.explainability.strongestSignals.map((item) => (
              <p key={item.label}>
                {item.label}: {item.score}%
              </p>
            ))}
            <strong>Weakest Signals</strong>
            {matchScore.explainability.weakestSignals.map((item) => (
              <p key={item.label}>
                {item.label}: {item.score}%
              </p>
            ))}
          </article>
        )}
        {proposal && (
          <article className="panel">
            <h2>AI Proposal Draft</h2>
            <pre>{proposal}</pre>
          </article>
        )}
      </div>
    </section>
  );
};

export default ProjectDetails;
