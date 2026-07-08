const Bar = ({ label, value }) => (
  <div className="score-row">
    <div className="score-head">
      <span>{label}</span>
      <strong>{value}%</strong>
    </div>
    <div className="score-track">
      <div className="score-fill" style={{ width: `${value}%` }} />
    </div>
  </div>
);

const MatchScoreCard = ({ score }) => {
  if (!score) return null;

  return (
    <section className="panel">
      <h2>AI Match Score</h2>
      <Bar label="Frontend Skills" value={score.frontendSkills} />
      <Bar label="React Experience" value={score.reactExperience} />
      <Bar label="Budget Match" value={score.budgetMatch} />
      <Bar label="Availability" value={score.availability} />
      <Bar label="Execution Velocity" value={score.executionVelocity || 0} />
      <Bar label="Communication Fit" value={score.communicationFit || 0} />
      <Bar label="Overall Match" value={score.overallMatch} />

      <div className="result-box compact-box">
        <p>
          <strong>Hiring Lane:</strong> {score.hiringLane || "-"}
        </p>
        <p>
          <strong>Confidence:</strong> {score.confidence || 0}%
        </p>
        <p>
          <strong>Risk Level:</strong> {score.riskLevel || "Low"}
        </p>
      </div>

      {!!score.riskFlags?.length && (
        <div className="result-box compact-box">
          <strong>Risk Radar</strong>
          {score.riskFlags.map((flag) => (
            <p key={flag}>- {flag}</p>
          ))}
        </div>
      )}

      {!!score.recommendations?.length && (
        <div className="result-box compact-box">
          <strong>AI Recommendations</strong>
          {score.recommendations.map((item) => (
            <p key={item}>- {item}</p>
          ))}
        </div>
      )}
    </section>
  );
};

export default MatchScoreCard;
